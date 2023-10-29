# github_drop
drop to upload

```js

var env ={}
env.auth
env.owner
env.repo
env.dir

var gd = github_drop(env)
gd.drop(async(file)=>{
 path = env.dir + 'name.jpg'
 var download_url=await gd.up(path,file)
 console.log(download_url)
 var data = await fetch(download_url).then(d=>d.blob);

});


```
