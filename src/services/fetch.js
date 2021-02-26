import qs from "qs";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
export default function fetch({
  method = "get",
  url,
  data,
  params,
  isReturnAllInfor = false,
  isJSON = false
}) {
  NProgress.start();
  let option = {
    method,
    url,
    data: data instanceof FormData
        ? data
        : isJSON
            ? data
            : qs.stringify(data),
    params
  };

  if (url != "/api/login") option.headers = { Authorization: this.state.token };
  return axios(option)
    .then(function({ data }) {
      NProgress.done();
      const codeFormat = parseInt(data.code)
      if (codeFormat === 0) {
          return isReturnAllInfor ? data : data.data;
      } else if(codeFormat === 400001 || codeFormat === 9999) {
          location.href = location.origin + location.pathname + '#/login'
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
