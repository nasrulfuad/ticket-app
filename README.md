# Requirements

    - docker
    - kubernetes/minikube
    - skaffold

# How to run

1. Install dependencies on all services `yarn` or `npm install`
2. Get minikube ip `minikube ip`
3. Edit your `/etc/hosts` and on the last line add `minikube_ip ticket.com`
    - if you want to use another domain just edit `infra/k8s/ingress.yaml`
    - On the host property edit `ticket.com` with your domain
    - And dont forget to update your `/etc/hosts` as well
4. Enable ingress in minikube `minikube addons list` then `minikube addons enable ingress`
5. Run skaffold `skaffold dev`
