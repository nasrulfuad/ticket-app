import axios from "axios";

export default function buildClient({ req }) {
  if (typeof window === "undefined")
    return axios.create({
      baseURL: "http://ingress-nginx-controller.kube-system.svc.cluster.local",
      headers: req.headers,
    });

  return axios.create({
    baseURL: "/",
  });
}
