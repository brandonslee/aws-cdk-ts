import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import { HitCounter } from './hitcounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // define an AWS Lambda resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromAsset('lambda'),  // code loaded from lambda directory (relative to cdk)
      handler: 'hello.handler'  // hello: file name, handler: exported function
    });

    // creates a Lambda function HitCounter
    const hellowWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });

    // defines an API Gateway REST API resource backed by our 'hello' function
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hellowWithCounter.handler
    });

    // https://www.npmjs.com/package/cdk-dynamo-table-viewer for test, not for production
    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: hellowWithCounter.table,
      sortBy: '-hits'

    });

    
  }
}
