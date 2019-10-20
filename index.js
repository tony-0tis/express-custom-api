const allMethodsList = require('methods');

module.exports = express=>{
  express.application.info = info;
  express.application.getInfo = getInfo;
  express.Router.info = info;
  express.Router.getInfo = getInfo;
};

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
      if(stackPath == '' && router.path){
        stackPath = router.path;
      }

      let path = fullpath.concat(stackPath.split('/'));
      
      if(!onlyThisLevel && stack.name == 'router' && stack.handle && stack.handle.stack){
        stackInfo = stackInfo.concat(mapStack(stack.handle, path));
      }
      else if(!onlyThisLevel && stack.route){
        methods = methods.concat(mapStack(stack.route, fullpath).map(method=>{
          return (method.info && method.info.method ? method.info.method + '||>>>' : '') + method.path;
        }));
      }
      else{
        if(stackPath != ''){
          methods.push((stack.method ? stack.method + '||>>>' : '') + path.join('/').replace(/\/\//g, '/'));
        }
      }
    });

    (router.methodsInfo || []).map(method=>{
      let infoPath = fullpath.concat(method.path.split('/')).join('/').replace(/\/\//g, '/');
      let path = infoPath;
      let match = false;

      if(method.info && method.info.method){
        path = method.info.method + '||>>>' + path;
        
        if(method.info.method == 'all'){
          allMethodsList.map(m=>{
            let index = methods.indexOf(m + '||>>>' + infoPath);
            if(index > -1){
              match = true;
              methods.splice(index, 1);
            }
          });
        }
      }
      
      let index = methods.indexOf(path);
      if(index > -1){
        match = true;
        methods.splice(index, 1);
      }

      methodsInfo.push({
        path: infoPath,
        type: 'info',
        methodMatch: match,
        info: method.info
      });
    });

    if(methods.length){
      methods.forEach(path=>{
        let method = null;
        if(path.indexOf('||>>>') > -1){
          [method, path] = path.split('||>>>');
        }

        let info = {
          path: path,
          type: 'method'
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