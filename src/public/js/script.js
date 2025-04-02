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

        // Redirect to the blog details page after 1.5 seconds
        setTimeout(() => {
            window.location.href = `/blogs/view/${blogId}`;
        }, 1500);
    });
});

// $(document).ready(function () {
//     $(".addblog").click(function (event) {
//         event.preventDefault(); // Prevent the default form submission

//         const form = this;

//         Swal.fire({
//             title: 'Are you sure?',
//             text: 'Do you want to add this blog?',
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'Yes, add it!',
//             cancelButtonText: 'No, cancel!',
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 // Show loading indicator
//                 Swal.fire({
//                     title: 'Adding Blog...',
//                     text: 'Please wait while we add your blog.',
//                     allowOutsideClick: false,
//                     didOpen: () => {
//                         Swal.showLoading();
//                     }
//                 });

//                 // Submit the form programmatically
//                 form.submit();
//             }
//         });
//     });
// });
