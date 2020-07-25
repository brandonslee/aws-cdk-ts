#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { IamRoleCreateStack } from '../lib/iam_role_create-stack';

const app = new cdk.App();
new IamRoleCreateStack(app, 'IamRoleCreateStack');
