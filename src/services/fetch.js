import qs from "qs";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
export default function fetch({
  method = "get",
  url,
  data,
  params,
  isJSON = false
}) {
  NProgress.start();
  let option = {
    method,
    url,
    data: isJSON ? data : qs.stringify(data),
    params
  };
  if (url != "/api/login") option.headers = { Authorization: this.state.token };
  return axios(option)
    .then(function({ data }) {
      NProgress.done();
      if (parseInt(data.code) === 0) {
          return data.data;
      } else {
        throw {
          code: data.code,
          message: data.msg
        };
      }
    })
    .catch(e => {
      NProgress.done();
      throw e;
    });
}
