import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as dynamodb from '@aws-cdk/aws-dynamodb';


export class MyTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const bucket = new s3.Bucket(this, "UserImagesS3Bucket", {
      cors: [
        {
          allowedMethods: [ s3.HttpMethods.GET,
            s3.HttpMethods.HEAD,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
            ],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          exposedHeaders: ['ETag'],
        },
      ]
    });

    const role = new iam.Role(this, "acidBackendProcessingLambdaRole", {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      path: "/DigitalBooks/",
    });

    let policy = new iam.Policy(this, 'LambdaWriteCWLogs');
    policy.addStatements(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
        'xray:PutTraceSegments',
        'xray:PutTelemetryRecords'
      ],
      effect: iam.Effect.ALLOW,
      sid: 'AllowLogging',

    }));
    role.attachInlinePolicy(policy);

    policy = new iam.Policy(this, 'ReadFromUserImagesS3Bucket');
    policy.addStatements(new iam.PolicyStatement({
      resources: ['arn:aws:s3:::*'],
      actions: ['s3:Get*',
        's3:List*',        
        ],
    }));
    role.attachInlinePolicy(policy);

    policy = new iam.Policy(this, 'WriteToUserImagesS3Bucket');
    policy.addStatements(new iam.PolicyStatement({
      resources: [cdk.Fn.sub('arn:aws:s3:::${UserImagesS3BucketArn}/*', 
        // Prevents from error "Unresolved resource dependencies [UserImagesS3BucketArn] in the Resources block of the template"  
        {'UserImagesS3BucketArn': bucket.bucketName,
        }),      
        ],
      actions: ['s3:PutObject',
        ],
    }));
    role.attachInlinePolicy(policy);

    

    
    // Create CloudFormation Outputs
    /*
    new cdk.CfnOutput(this, 'UserImagesS3BucketArn', {
      value: cdk.Fn.ref(bucket.bucketName)
    });
    */

    //CloudFormation Parameters
    new cdk.CfnParameter(this, 'S3PathPrefix', {
      type: 'String',
      description: 'The path prefix where lab resources are stored (Leading and trailing slash required!)',
      default: 'awsu-spl/spl-254/1.0.2.prod',
    });

    
    const dynamodbTable = new dynamodb.CfnTable(this, 'ImageMetadataDDBTable', {
      attributeDefinitions: [
        { attributeName: 'albumID',
        attributeType: 'S' },
        { attributeName: 'imageID',
        attributeType: 'S' },
        { attributeName: 'uploadTime',
        attributeType: 'N' },
      ],
      globalSecondaryIndexes: [
        {
          indexName: 'albumID-uploadTime-index',
          keySchema: [
            { attributeName: 'albumID',
              keyType: 'HASH' },
            { attributeName: 'uploadTime',
              keyType: 'RANGE' },
          ],
          projection: { projectionType: 'ALL' },
          provisionedThroughput: { readCapacityUnits: 3, writeCapacityUnits: 3 },
        }
      ],
      keySchema: [
        { attributeName: 'imageID', 
        keyType: 'HASH' },
      ],
      provisionedThroughput: { readCapacityUnits: 3,writeCapacityUnits: 3 }
      
    });
     
  }
}
