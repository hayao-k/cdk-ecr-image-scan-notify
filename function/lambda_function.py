"""
This is a sample function to send ECR Image Scan findings severity counts to slack.
Environment variables:
    WEBHOOK_URL: Incoming Webhook URL
"""

from datetime import datetime
from logging import getLogger, INFO
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
import json
import os
import re

logger = getLogger()
logger.setLevel(INFO)

def get_properties(finding_counts):
    """Returns the color setting of severity"""
    if finding_counts['CRITICAL'] != 0:
        properties = {'color': 'danger', 'icon': ':red_circle:'}
    elif finding_counts['HIGH'] != 0:
        properties = {'color': 'warning', 'icon': ':large_orange_diamond:'}
    else:
        properties = {'color': 'good', 'icon': ':green_heart:'}
    return properties

def get_repo_name(repo_arn):
    """Return repository name from ARN"""
    result = re.match('.*?(/.+).*', repo_arn)
    repo_name = result.group(1)
    return repo_name[1:]

def get_params(event):
    """Slack message formatting"""
    severity_list = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMAL', 'UNDEFINED']
    finding_counts = event['detail']['finding-severity-counts']

    for severity in severity_list:
        finding_counts.setdefault(severity, 0)

    text_properties = get_properties(finding_counts)

    if event['source'] == "aws.inspector2":
        scan_type = "Enhanced scanning"
        repo_name = get_repo_name(event['detail']['repository-name'])
    else:
        scan_type = "Basic scanning"
        repo_name = event['detail']['repository-name']

    complete_at = datetime.strftime(
        datetime.strptime(event['time'], '%Y-%m-%dT%H:%M:%S%z'), '%Y-%m-%d %H:%M:%S %Z')

    slack_message = {
        'username': 'Amazon ECR',
        'icon_emoji': ':ecr:',
        'text': f'''*ECR Image Scan findings | {event['region']} | Account:{event['account']}*''',
        'attachments': [
            {
                'fallback': 'AmazonECR Image Scan Findings Description.',
                'color': text_properties['color'],
                'title': f'''{text_properties['icon']} {repo_name}:{
                    event['detail']['image-tags'][0]}''',
                'title_link': f'''https://console.aws.amazon.com/ecr/repositories/private/{
                    event['account']}/{repo_name}/image/{
                    event['detail']['image-digest']}/scan-results/?region={event['region']}''',
                'text': f'''*Scan Type:* {scan_type}\n*Scan Status:* {
                    event['detail']['scan-status']}\n*Timestamp:* {complete_at}''',
                'fields': [
                    {'title': 'Critical', 'value': finding_counts['CRITICAL'], 'short': True},
                    {'title': 'High', 'value': finding_counts['HIGH'], 'short': True},
                    {'title': 'Medium', 'value': finding_counts['MEDIUM'], 'short': True},
                    {'title': 'Low', 'value': finding_counts['LOW'], 'short': True},
                    {'title': 'Informational', 'value': finding_counts['INFORMAL'], 'short': True},
                    {'title': 'Undefined', 'value': finding_counts['UNDEFINED'], 'short': True},
                ]
            }
        ]
    }
    return slack_message

def get_error_params(event):
    """Slack error message formatting"""
    slack_message = {
        'username': 'Amazon ECR',
        'icon_emoji': ':ecr:',
        'text': f'''*ECR Image Scan findings | {event['region']} | Account:{event['account']}*''',
        'attachments': [
            {
                'fallback': 'AmazonECR Image Scan Findings Description.',
                'color': 'danger',
                'title': f''':red_circle: {event['detail']['repository-name']}:{
                    event['detail']['image-tags'][0]}''',
                'title_link': f'''https://console.aws.amazon.com/ecr/repositories/private/{
                    event['account']}/{event['detail']['repository-name']}/_/image/{
                    event['detail']['image-digest']}/details/?region={event['region']}''',
                'text': f'''*Scan Status:* {event['detail']['scan-status']}''',
            }
        ]
    }
    return slack_message

def lambda_handler(event, context):
    """AWS Lambda Function to send ECR Image Scan findings severity counts to Slack"""
    response = 1

    if event['detail']['scan-status'] == 'FAILED':
        slack_message = get_error_params(event)
    else:
        slack_message = get_params(event)

    req = Request(os.environ['WEBHOOK_URL'], json.dumps(slack_message).encode('utf-8'))

    try:
        with urlopen(req) as res:
            res.read()
            logger.info("Message posted.")
    except HTTPError as err:
        logger.error("Request failed: %d %s", err.code, err.reason)
    except URLError as err:
        logger.error("Server connection failed: %s", err.reason)
    else:
        response = 0

    return response
