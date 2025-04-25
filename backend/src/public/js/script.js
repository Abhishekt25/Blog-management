$(document).ready(function () {
    $(".view-details").click(function () {
        let blogId = $(this).data("id");

        Swal.fire({
            title: 'Loading...',
            text: 'Redirecting to blog details...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        setTimeout(() => {
            window.location.href = `/blogs/view/${blogId}`;
        }, 1500);
    });
});


$(document).ready(function () {
    $("#addBlogForm").submit(function (event) {
      event.preventDefault();

      const form = this;
      const formData = new FormData(form);

      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add this blog?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, add it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Adding Blog...',
            text: 'Please wait while we add your blog.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          $.ajax({
            url: '/blogs/create',
            method: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
              Swal.fire({
                icon: 'success',
                title: 'Blog added!',
                text: response.message || 'Blog created successfully.',
                timer: 2000,
                showConfirmButton: false
              }).then(() => {
                window.location.href = '/blogs';
              });
            },
            error: function (xhr, status, error) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: xhr.responseJSON?.message || 'Something went wrong while adding your blog.'
              });
            }
          });
        }
      });
    });
  });
  