import * as blueprints from '@aws-quickstart/eks-blueprints';
import { createNamespace } from '@aws-quickstart/eks-blueprints/dist/utils';
import { Construct } from 'constructs';
import { merge } from 'ts-deepmerge';

export interface KubesharkAddOnProps extends blueprints.addons.HelmAddOnUserProps {
    /**
     * To Create Namespace using CDK
     */
    createNamespace?: boolean;
}

/**
 * Default options for the add-on
 */
export const defaultProps: blueprints.addons.HelmAddOnProps & KubesharkAddOnProps = {
    chart: 'kubeshark',
    repository: 'https://helm.kubeshark.co',
    version: '52.3.0',
    release: 'blueprints-addon-kubeshark',
    name: 'kubeshark',
    namespace: 'kube-system',
    createNamespace: false,
};

export class KubesharkAddOn extends blueprints.addons.HelmAddOn {
    readonly options: KubesharkAddOnProps;

    constructor(props?: KubesharkAddOnProps) {  // Make props optional
        super({ ...defaultProps, ...props });
        this.options = { ...defaultProps, ...props } as KubesharkAddOnProps;
    }

    deploy(clusterInfo: blueprints.ClusterInfo): Promise<Construct> {
        const cluster = clusterInfo.cluster;
        let values: blueprints.Values = this.options.values ?? {};
        values = merge(values, this.options.values ?? {});

        const chart = this.addHelmChart(clusterInfo, values);

        if (this.options.createNamespace === true) {
            // Let CDK create the namespace
            const namespace = createNamespace(this.options.namespace!, cluster);
            chart.node.addDependency(namespace);
        }

        return Promise.resolve(chart);
    }
}
