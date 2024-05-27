import * as cdk from 'aws-cdk-lib';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { KubesharkAddOn } from 'kubeshark';

const app = new cdk.App();
const account = '1234123412341';
const region = 'us-east-1';
const version = 'auto';

blueprints.HelmAddOn.validateHelmVersions = true; // optional if you would like to check for newer versions

const addOns: Array<blueprints.ClusterAddOn> = [
    new blueprints.addons.MetricsServerAddOn(),
    new blueprints.addons.ClusterAutoScalerAddOn(),
    new blueprints.addons.AwsLoadBalancerControllerAddOn(),
    new blueprints.addons.VpcCniAddOn(),
    new blueprints.addons.CoreDnsAddOn(),
    new blueprints.addons.KubeProxyAddOn(),
    new KubesharkAddOn({})  // Provide an empty object if no specific properties are needed
];

const stack = blueprints.EksBlueprint.builder()
    .account(account)
    .region(region)
    .version(version)
    .addOns(...addOns)
    .useDefaultSecretEncryption(true) // set to false to turn secret encryption off (non-production/demo cases)
    .build(app, 'eks-blueprint');
