
(() => {
  const forms = document.querySelectorAll('.needs-validation');

  forms.forEach(form => {
    form.addEventListener('submit', event => {

      event.preventDefault();
      event.stopPropagation();

      if (form.checkValidity()) {

        form.classList.add('was-validated');

        const modalEl = form.closest('.modal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        const toastEl = document.getElementById('successToast');
        const toast = new bootstrap.Toast(toastEl);
        toast.show();

        setTimeout(() => {
          form.reset();
          form.classList.remove('was-validated');
        }, 300);

      } else {
        form.classList.add('was-validated');
      }
    });
  });
})();

function markLoaded(img) {
  const item = img.closest('.carousel-item');
  if (item) item.classList.add('loaded');
}

document.querySelectorAll('.carousel img').forEach(img => {
  img.addEventListener('load', () => markLoaded(img));
  img.addEventListener('error', () => markLoaded(img));
  if (img.src && img.complete) markLoaded(img);
});

document.querySelectorAll('.carousel').forEach(carousel => {
  carousel.addEventListener('slide.bs.carousel', e => {
    e.relatedTarget.querySelectorAll('img[data-src]').forEach(img => {
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
        img.removeAttribute('data-src');
        if (img.complete) markLoaded(img);
      }
    });
  });
});

const destinosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.carousel-item.active img[data-src]').forEach(img => {
        const src = img.getAttribute('data-src');
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          if (img.complete) markLoaded(img);
        }
      });
      destinosObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '200px' });


function nav_Section (idSection){
  document.getElementById(idSection).scrollIntoView({
    behavior: "smooth"
  });
}


const destinosSection = document.getElementById('destinos');
if (destinosSection) destinosObserver.observe(destinosSection);

document.getElementById('btn-destinos').addEventListener("click", () => {
  nav_Section('destinos');
});


const btnsConsult = document.querySelectorAll('.consult-button');

const selectOpt = document.getElementById('destination-selected');

btnsConsult.forEach(function(btn){
  btn.addEventListener("click", () => {

    document.getElementById('form-section').style.display = 'flex';

    

    selectOpt.value = btn.dataset.destination;

   
    selectOpt.dispatchEvent(new Event('change'));



    nav_Section('form-section');

  });
});


function costeHotel(noches) {
  const precioNoche = 60;

  let precioTotal = noches * precioNoche;

  return precioTotal;
}

function costeAvion(nombreCiudad) {
  let precioAvion = 0;
  switch(nombreCiudad){
      case "Paris":
          precioAvion = 180;
          break;
      case "Boston":
          precioAvion = 600;
          break;
      case "Londres":
          precioAvion = 120;
          break;
      case "Roma":
          precioAvion = 130;
          break;
      case "Sevilla":
          precioAvion = 80;
          break;
      case "Rio":
          precioAvion = 1400;
          break;
      case "Kioto":
          precioAvion = 1100;
          break;
      case "Buenos Aires":
          precioAvion = 1200;
          break;
  }

  return precioAvion;
}

function costeCoche(diasAlquiler) {

  const precioDia = 40;
  const precioBase = diasAlquiler * precioDia;

  let descuento = 0;

  if(diasAlquiler >= 7) {
      descuento = 50;
  } else if(diasAlquiler >= 3) {
      descuento = 20;
  } 

  const precioTotal = precioBase - descuento;

  return {precioBase, precioTotal, descuento};

}

function costeViaje() {
  let boton = document.getElementById('btn-calcular');

  const hotel = document.getElementById('precio-hotel');
  const vuelo = document.getElementById('precio-vuelo');
  const coche = document.getElementById('precio-coche');
  const descuento = document.getElementById('descuento');
  const precioPersona = document.getElementById('precio-persona');

  const totalViaje = document.getElementById('precio-total');

  boton.addEventListener('click', () => {

      descuento.textContent = ""

      let noches = document.getElementById('num-night').value;
      let ciudad = document.getElementById('destination-selected').value;
      let diasAlquiler = document.getElementById('num-day').value;
      let numPersonas = document.getElementById('num-people').value;
      console.log(numPersonas);


      const precioHotel = costeHotel(noches);
      const precioAvion = costeAvion(ciudad);
      const precioCoche = costeCoche(diasAlquiler);

  
      hotel.textContent = precioHotel;
      vuelo.textContent = precioAvion;
      coche.textContent = precioCoche.precioBase;
     

      if(precioCoche.descuento > 0) {
          descuento.textContent = ` -${precioCoche.descuento}€ descuento`
      }
  
      precioPersona.textContent = precioHotel + precioAvion + precioCoche.precioTotal;
      let precioFinal = precioCoche.precioTotal + ((precioHotel + precioAvion) * numPersonas);
  
      totalViaje.textContent = `${precioFinal} €`;

      const seccion = document.getElementById("price");
      const offset = 150; // 150px antes de la sección

      window.scrollTo({
        top: seccion.offsetTop - offset,
        behavior: "smooth"
      });
    

  });

}

const form = document.getElementById('travelForm');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  form.classList.add('was-validated');

  if (!form.checkValidity()) return;

  costeViaje();
});





