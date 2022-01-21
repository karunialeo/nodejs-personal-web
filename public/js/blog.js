function deleteBlog(id) {
    const deleteBlogConfirm = new bootstrap.Modal(document.getElementById('deleteBlogConfirm'))
    deleteBlogConfirm.show()

    const deleteBlog = document.getElementById('deleteBlog')
    deleteBlog.addEventListener('click', function() {
        const a = document.createElement('a')
        a.href = `/delete/${id}`
        a.click()
    })
}

function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
  
      reader.onload = function (e) {
        $('#prevImage')
          .attr('src', e.target.result);
      };
  
      reader.readAsDataURL(input.files[0]);
    }
  }