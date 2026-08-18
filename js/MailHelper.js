document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const subject = document.getElementById("subject").value; 
  const message = document.getElementById("message").value;

  const body = encodeURIComponent(
    `Hi Matthijs,\n\n${message}\n\nKind regards,\n${name}`
  );

  window.location.href =
    `mailto:schoonenmatthijs@gmail.com?subject=${subject}&body=${body}`;
});

