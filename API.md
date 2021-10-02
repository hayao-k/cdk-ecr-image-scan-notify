# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### EcrImageScanNotify <a name="cdk-ecr-image-scan-notify.EcrImageScanNotify"></a>

#### Initializers <a name="cdk-ecr-image-scan-notify.EcrImageScanNotify.Initializer"></a>

```typescript
import { EcrImageScanNotify } from 'cdk-ecr-image-scan-notify'

new EcrImageScanNotify(scope: Construct, id: string, props: EcrImageScanNotifyProps)
```

##### `scope`<sup>Required</sup> <a name="cdk-ecr-image-scan-notify.EcrImageScanNotify.parameter.scope"></a>

- *Type:* [`@aws-cdk/core.Construct`](#@aws-cdk/core.Construct)

---

##### `id`<sup>Required</sup> <a name="cdk-ecr-image-scan-notify.EcrImageScanNotify.parameter.id"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="cdk-ecr-image-scan-notify.EcrImageScanNotify.parameter.props"></a>

- *Type:* [`cdk-ecr-image-scan-notify.EcrImageScanNotifyProps`](#cdk-ecr-image-scan-notify.EcrImageScanNotifyProps)

---





## Structs <a name="Structs"></a>

### EcrImageScanNotifyProps <a name="cdk-ecr-image-scan-notify.EcrImageScanNotifyProps"></a>

#### Initializer <a name="[object Object].Initializer"></a>

```typescript
import { EcrImageScanNotifyProps } from 'cdk-ecr-image-scan-notify'

const ecrImageScanNotifyProps: EcrImageScanNotifyProps = { ... }
```

##### `channel`<sup>Required</sup> <a name="cdk-ecr-image-scan-notify.EcrImageScanNotifyProps.property.channel"></a>

```typescript
public readonly channel: string;
```

- *Type:* `string`

---

##### `webhookUrl`<sup>Required</sup> <a name="cdk-ecr-image-scan-notify.EcrImageScanNotifyProps.property.webhookUrl"></a>

```typescript
public readonly webhookUrl: string;
```

- *Type:* `string`

---



