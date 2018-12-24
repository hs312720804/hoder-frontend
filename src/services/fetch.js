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
  return axios({
    method,
    url,
    data: isJSON ? data : qs.stringify(data),
    params
    // headers: {
    //   Authorization: this.state.token
    // }
  })
    .then(function({ data }) {
      NProgress.done();
      if (data.code === 0) {
        if (typeof data.data != undefined) 
          return data.data;
        else 
          return data;
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
