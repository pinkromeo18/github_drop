//https://qiita.com/elastic/items/aef72b8803d70a25f468
;(function(root){
  const resizeImage = (imgEL, maxSize, type = 'image/jpg') =>
  new Promise(resolve => {

    const ratio = imgEL.naturalWidth / imgEL.naturalHeight
    const canvas = document.createElement('canvas')

    //canvas.width = ratio >= 1 ? maxSize : maxSize / ratio
    //canvas.height = ratio < 1 ? maxSize : maxSize / ratio

    canvas.width = maxSize
    canvas.height = maxSize / ratio

    canvas.getContext('2d').drawImage(imgEL, 0, 0, canvas.width, canvas.height)
    canvas.toBlob(resolve, type, 0.6)
  })

  const pFileReader = blob =>
  new Promise(resolve => {
    const fr = new FileReader()
    fr.readAsDataURL(blob)
    fr.onload = e => resolve(e.target.result)
  })

  const pImage = src =>
  new Promise(resolve => {
    const img = new Image()
    img.src = src
    img.onload = e => resolve(img)
  })

  const sleep =time=> new Promise(sol=>setTimeout(sol,time||1000) )

  function isElement(node) {
    return !!(node && node.nodeName)
  }

  async function resizer(file,width){
    const el = isElement(file) ? file
    : await pImage(await pFileReader(file))
    const blob = await resizeImage(el,width||300, file.type)
    return blob;  
  }
  /////////////
  root.resizer = resizer
  /////////////
})(this||window);  

/* 
//  <input type="file">
document.querySelector('input').onchange = async e => {
  const file = e.target.files[0]
  var blob = await resizer(file,300)
  var img = new Image()
  img.src = URL.createObjectURL(blob)
  document.body.append(img)

}
*/
