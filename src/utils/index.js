//顶端提示消息统一方法
export function showMessage(that, msg, type = 'success') {
  that.$message({
    message: msg,
    type: type,
    center: true,
    showClose: true
  });
}

//性别
export function genderJudge(value) {
  if (value == 0) {
    return '男'
  } else if (value == 1) {
    return '女'
  } else {
    return '暂无'
  }
}

//确认信息统一方法,有问题，暂不用
export function confirmMessage(that, msg, done, errorMsg = "服务器繁忙，请稍后再试") {
  that.$confirm(msg, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      center: true
    })
    .then(done())
    .catch(() => {
      showMessage(that, errorMsg, "error");
    });
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"')
    .replace(/\+/g, ' ') +
    '"}'
  )
}


//统一下载方法
export function downloadFile(resp,fileName) {
  let blob = new Blob([resp], {
    type: "application/octet-stream"
  });

  if (typeof window.navigator.msSaveBlob !== "undefined") {
    window.navigator.msSaveBlob(blob, fileName);
  } else {
    var blobURL = window.URL.createObjectURL(blob);
    var tempLink = document.createElement("a");
    tempLink.style.display = "none";
    tempLink.href = blobURL;
    tempLink.setAttribute("download", fileName);
    if (typeof tempLink.download === "undefined") {
      tempLink.setAttribute("target", "_blank");
    }
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    window.URL.revokeObjectURL(blobURL);
  }
}
