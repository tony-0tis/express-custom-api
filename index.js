function info(path, info){
  if(this.lazyrouter){
    this.lazyrouter();
    this._router.info(path, info);
    return;
  }

  this.methodsInfo = this.methodsInfo || [];
  this.methodsInfo.push({path: path, info: info});
}
function getInfo(onlyThisLevel){
  let router = this;
  if(this._router){
    router = this._router;
  }

  let mapStack = (router, fullpath)=>{
    let methods = [];
    let methodsInfo = [];
    let stackInfo = [];
    router.stack.forEach(stack=>{
      let stackPath = stack.regexp.toString().replace('\\/?', '').replace('(?=\\/|$)', '$').match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)[1].replace(/\\(.)/g, '$1');

      let path = fullpath.concat(stackPath.split('/'));
      
      if(!onlyThisLevel && stack.name == 'router' && stack.handle && stack.handle.stack){
        stackInfo = stackInfo.concat(mapStack(stack.handle, path));
      }
      else if(!onlyThisLevel && stack.route){
        stackInfo = stackInfo.concat(mapStack(stack.route, path));
      }
      else{
        if(stackPath != ''){
          methods.push(stack.method ? stack.method + '||>>>' : '' + path.join('/').replace(/\/\//g, '/'));
        }
      }
    });

    (router.methodsInfo || []).map(info=>{
      let method = fullpath.concat(info.path.split('/')).join('/').replace(/\/\//g, '/');
      if(info.info && info.info.method){
        method = info.info.method + '||>>>' + method;
      }

      let active = false;
      let index = methods.indexOf(method);
      if(index > -1){
        active = true;
        methods.splice(index, 1);
      }

      methodsInfo.push({
        path: method,
        active: active,
        info: info.info
      });
    });

    if(methods.length){
      methods.forEach(m=>{
        let method = null;
        if(m.indexOf('||>>>') > -1){
          [method, m] = m.split('||>>>');
        }

        let info = {
          path: m,
          active: true,
          noInfo: true
        }

        if(method){
          info.info = {
            method: method
          };
        }

        methodsInfo.push(info);
      });
    }

    methodsInfo = methodsInfo.concat(stackInfo);

    return methodsInfo;
  };

  return mapStack(router, [])
}

module.exports = express=>{
  express.application.info = info;
  express.application.getInfo = getInfo;
  express.Router.info = info;
  express.Router.getInfo = getInfo;
};