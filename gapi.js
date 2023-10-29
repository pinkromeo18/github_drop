import { Octokit } from "https://esm.sh/@octokit/core";
import "//pinkromeo18.github.io/github_drop/resizer.js"

/*
const pu = (d,ispre) =>{
  const el = document.createElement('div')  
  el.innerText = is.string(d)?d:JSON.stringify(d,null,'\n')
  ;ispre? document.body.prepend(el): document.body.append(el)
  return el;
}
*/

export function gapi({auth,owner,repo,dir}){
  //////////////////////////////////////////
  //////////////////////////////////////////
  function base64Decode(text, charset) {
    charset=charset||'utf-8';
    return fetch(`data:text/plain;charset=${charset};base64,` + text)
      .then(response => response.text());
  }

  function base64Encode(...parts) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        const offset = reader.result.indexOf(",") + 1;
        resolve(reader.result.slice(offset));
      };
      reader.readAsDataURL(new Blob(parts));
    });
  }
  const r8 = () => Math.random().toString(36).slice(2)
  .padEnd(8,'0').slice(0,8)
  const r8a = () => r8().replace(/[0-9]/g,'x')
  const isdup = d => !(d.length === new Set(d).size)
  const timechank= () => {
    var x = new Date(Date.now() + 9*60*60*1000)
    return x.toISOString().split('T').at(0).replace(/-/g,'').slice(2)
  }
  function chank(){
    var a=r8a().slice(-3).toUpperCase()
    var b=timechank()
    return b+a+'_'
  }

  //////////////////////////////////////////
  //////////////////////////////////////////

  var o=Object.assign({},{auth,owner,repo,dir})
  o.octokit = new Octokit({auth})

  ///////////////////////////////////////////
  async function _res(file){    
    //pu('in is');
    file =file||''
    let {octokit} = o;
    // Octokit.js
    // https://github.com/octokit/core.js#readme
    let path = dir + file
    path = path.at(-1) === '/'?path.slice(0,-1):path

    let  res
    try{
      res = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
    }catch(e){
      res = void 0;
      console.log('maybe not found:',path,e)
    }
    return res;
  }
  ///////////////////////////////////////////
  async function get(file){
    let res = await geturl(file)
    return res? await fetch(res,{cache: "no-cache"}).then(d=>d.text()): null
    //return res?await base64Decode(res.data.content):null
  }  
  ///////////////////////////////////////////
  async function getsha(file){
    let res = await _res(file)
    return res?res.data.sha:null
  }
  ///////////////////////////////////////////
  async function geturl(file){
    let res = await _res(file)
    return res?res.data.download_url:null    
  }
  ///////////////////////////////////////////


  ///////////////////////////////////////////
  async function up(file,data,isimg){    
    console.log('in up');
    if(!file) return console.log("up() is need filename!")

    let {octokit} = o;
    // Octokit.js
    // https://github.com/octokit/core.js#readme
    let path = dir + file
    path = path.at(-1) === '/'?path.slice(0,-1):path
    //console.log('?????',path)
    let sha = await getsha(file)
    let message = new Date().toString()
    let  res
    try{

      // Octokit.js
      // https://github.com/octokit/core.js#readme

      res =await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner,
        repo,
        path,
        message,
        content: await base64Encode(data),
        sha,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })      

    }catch(e){
      res = void 0;
      console.log('maybe not found:',path,e)
    }
    return res;
  }
  ///////////////////////////////////////////

  //////////////////////
  //////////////////////
  //////////////////////
  return Object.assign(o,{_res,up,get,getsha,geturl,chank})
}
