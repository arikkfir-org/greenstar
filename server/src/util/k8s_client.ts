import * as k8sClient from "@kubernetes/client-node"
import { V1Pod } from "@kubernetes/client-node"

// Create Kubernetes clients factory
const kc = new k8sClient.KubeConfig()
kc.loadFromDefault()

// Create Kubernetes API clients
export const coreAPI  = kc.makeApiClient(k8sClient.CoreV1Api)
export const appsAPI  = kc.makeApiClient(k8sClient.AppsV1Api)
export const batchAPI = kc.makeApiClient(k8sClient.BatchV1Api)

// Obtain current pod information
export const podNamespace: string = process.env.POD_NAMESPACE!
export const podName: string      = process.env.POD_NAME!
const namespace: string           = podNamespace

export const pod: V1Pod = await coreAPI.readNamespacedPod({ namespace, name: podName })

// Obtain controlling replica-set
const replicaSetOwner = pod.metadata!.ownerReferences!.find(ref => ref.kind === "ReplicaSet")
if (!replicaSetOwner) {
    throw new Error("Pod is not owned by a ReplicaSet")
}
export const replicaSet = await appsAPI.readNamespacedReplicaSet({ namespace, name: replicaSetOwner.name })

// Obtain controlling deployment
const deploymentOwner = replicaSet.metadata!.ownerReferences!.find(ref => ref.kind === "Deployment")
if (!deploymentOwner) {
    throw new Error("ReplicaSet is not owned by a Deployment")
}
export const deployment = await appsAPI.readNamespacedDeployment({ namespace, name: deploymentOwner.name })
