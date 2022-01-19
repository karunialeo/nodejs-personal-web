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