import * as cdk from '@aws-cdk/core';
import * as eks from '@aws-cdk/aws-eks';

export class EksClusterQuickStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const cluster = new eks.Cluster(this, 'hello-eks', {
      version: eks.KubernetesVersion.V1_20,
    });

    // apply a kubernetes manifest to the cluster
    cluster.addManifest('mypod', {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: { name: 'mypod' },
      spec: {
        containers: [
          {
            name: 'hello',
            image: 'paulbouwer/hello-kubernetes:1.10',
            ports: [ { containerPort: 8080 } ]
          }
        ]
      }
    });
    
  }
}
