"use strict";

// Parte 1: use estes dados para criar workshopPrototype e suas instancias.
const workshopData = [
    { id: 1, title: "Objetos e prototipos", description: "Crie objetos reutilizaveis e compreenda a cadeia de prototipos.", level: "Intermediario", duration: 90, instructorId: 1 },
    { id: 2, title: "Classes modernas", description: "Modele entidades com class, extends e super.", level: "Intermediario", duration: 75, instructorId: 2 },
    { id: 3, title: "JavaScript no navegador", description: "Organize eventos e atualizacoes de uma interface.", level: "Iniciante", duration: 60, instructorId: 1 },
    { id: 4, title: "Arquitetura frontend", description: "Separe dados, dominio e renderizacao em uma aplicacao.", level: "Avancado", duration: 105, instructorId: 3 }
];



const instructorData = [
    { id: 1, name: "Ana Souza", specialty: "JavaScript" },
    { id: 2, name: "Bruno Lima", specialty: "Arquitetura" },
    { id: 3, name: "Carla Mendes", specialty: "Frontend" }
];

//array de objetos com os dados que vão ser usados na renderização

const toastPrototype = {
    show(message, type = "success") {
        const element = document.querySelector("[data-toast]");
        if (!element) return;
        element.textContent = message;
        element.className = `toast is-visible is-${type}`;
        window.clearTimeout(this.timeout);
        this.timeout = window.setTimeout(() => element.classList.remove("is-visible"), 3500);
    }
};

//função do toast para exibir mensagens de sucesso, erro ou aviso

// Parte 1 - crie workshopPrototype, os workshops e as evidencias solicitadas.

const workshopPrototype = {
    getLabel(){return `${this.title} - ${this.description} - ${this.level} - ${this.duration}`},
    isAvailable(){return this.available}
}

//criação do protótipo

const workshop1 = Object.create(workshopPrototype)
workshop1.title = "Classes CSS"
workshop1.description = "Alguma coisa"
workshop1.level = "iniciante"
workshop1.duration = 60
workshop1.available = true

const workshop2 = Object.create(workshopPrototype)
workshop2.title = "Classes JS"
workshop2.description = "Alguma coisa"
workshop2.level = "intermediario"
workshop2.duration = 90
workshop2.available = false

//criação das instâncias do protótipo

console.log(Object.getPrototypeOf(workshop1) === workshopPrototype)
console.log(Object.getPrototypeOf(workshop2) === workshopPrototype)

//verificação se o protótipo das instâncias é o mesmo que o workshopPrototype

console.log(Object.hasOwn(workshop1, "title"))
console.log(Object.hasOwn(workshop2, "getLabel"))
//verificação se as instâncias possuem propriedades próprias ou herdadas do protótipo


workshopPrototype.enroll = function(){
    if(this.isAvailable() == false){
        console.log("Não é possível se inscrever, oficina indisponível")
        return false;
    }
    this.available = false
    console.log("Inscrição realizada com sucesso")
    return true;
}

//inserção de função no protótipo para que as instâncias possam se inscrever nas oficinas, alterando a propriedade available para false.

workshop1.enroll()
workshop2.enroll()

const schedule = {name: "Agendas das Oficinas", workshops: [workshop1, workshop2]}
const shallowCopy = {...schedule}
shallowCopy.workshops[0].title = "Classes JS Avançadas"
console.log(schedule.workshops[0].title)
console.log(shallowCopy.workshops[0].title)
//cópia rasa com spread operator, altera o título da primeira oficina em ambas as cópias, pois a referência do objeto é a mesma.


const deepCopy = structuredClone(schedule);
deepCopy.workshops[0].title = "Classes CSS avançadas"
console.log(schedule.workshops[0].title)
console.log(deepCopy.workshops[0].title)
//cópia profunda com structuredClone, altera o título da primeira oficina apenas na cópia profunda, pois a referência do objeto é diferente.

function expansionBlock()
{
    Object.preventExtensions(schedule);
    // schedule.teste = "teste" dá erro pq o objeto não pode ser expandido
    schedule.name = "Agenda das Oficinas Atualizada"
    delete schedule.workshops
    console.log(schedule)
}
// expansionBlock()
//previne adição de novas propriedades ao objeto, mas permite alteração e exclusão das existentes.

function sealBlock() 
{
    Object.seal(schedule);
    // schedule.teste = "teste" dá erro pq o objeto não pode ser expandido
    schedule.name = "Agenda das Oficinas Atualizada"
    // delete schedule.workshops
    console.log(schedule)
}
// sealBlock()
//previne adição e exclusão de propriedades ao objeto, mas permite alteração das existentes.

function freezeBlock()
{
    Object.freeze(schedule);
    // schedule.teste = "teste" dá erro pq o objeto não pode ser expandido
    // schedule.name = "Agenda das Oficinas Atualizada"
    // delete schedule.workshops
    console.log(schedule)
}
// freezeBlock()
//previne adição, exclusão e alteração de propriedades ao objeto, tornando-o completamente imutável.

// Parte 2 - implemente Instructor, Workshop e WorkshopCatalog.
// Os metodos devem ser definidos no prototipo das instancias.

const state = { instructors: [], workshops: [], selectedInstructorId: "", term: "" };
//objeto de estado para armazenar os dados dos instrutores, oficinas e filtros selecionados
const instructorFilter = document.querySelector("#instructor-filter");
const workshopFilter = document.querySelector("#workshop-filter");
const catalogStatus = document.querySelector("#catalog-status");
const workshopList = document.querySelector("#workshop-list");
const workshopDetail = document.querySelector("#workshop-detail");
const toast = Object.create(toastPrototype);
//criação da instância do toast para exibir mensagens na tela

class Instructor {
    constructor(id, name, specialty) {
        this.id = id;
        this.name = name;
        this.specialty = specialty;
    }

    getLabel() {
        return `${this.name} - ${this.specialty}`;
    }
}
//classe Instructor com construtor e método getLabel para retornar o nome e especialidade do instrutor.


class Workshop {
    constructor(id, title, description, level, duration, instructior)
    {
        this.id = id;
        this.title = title;
        this.description = description;
        this.level = level;
        this.duration = duration;
        this.instructor = instructior;
    }
    getSummary() {
        return `${this.duration}min - ${this.level} - ${this.instructor.getLabel()}`;
    }
}
//classe Workshop com construtor e método getSummary para retornar um resumo da oficina, incluindo duração, nível e informações do instrutor.

class WorkshopCatalog {
    constructor(workshops) {
        this.workshops = workshops;
    }

    list()
    {
        return this.workshops;
    }

    findById(id)
    {
        return this.workshops.find(workshop => workshop.id === id);
    }

    filterByTitle(term)
    {
        return this.workshops.filter(workshop => workshop.title.toLowerCase().includes(term.toLowerCase()));
    }
}
//classe WorkshopCatalog com construtor e métodos list, findById e filterByTitle para listar todas as oficinas, encontrar uma oficina por ID e filtrar oficinas por título, respectivamente.

const instructors = instructorData.map(data =>
    new Instructor(data.id, data.name, data.specialty)
);
//criação das instâncias de Instructor a partir dos dados do array instructorData

const workshops = workshopData.map(data => {
    const instructor = instructors.find(
        instructor => instructor.id === data.instructorId
    );
    //find acontece pois o array instructors já foi criado, então podemos buscar o instrutor correspondente ao id do workshop
//criação das instâncias de Workshop a partir dos dados do array workshopData, associando o instrutor correspondente a cada oficina    

    return new Workshop(
        data.id,
        data.title,
        data.description,
        data.level,
        data.duration,
        instructor
    );
});

const workshopCatalog = new WorkshopCatalog(workshops);
//criação da instância de WorkshopCatalog a partir do array de workshops

console.log(workshopCatalog.list());

console.log(workshopCatalog.findById(1));

console.log(workshopCatalog.filterByTitle("objetos"));

function renderWorkshops() {
    // TODO: use o catalogo, os filtros de state e renderize cards com botoes.
    let workshopsToRender = workshopCatalog.list();
    
    catalogStatus.textContent = `Carregando oficinas...`

    if(workshopsToRender.length === 0) {
        catalogStatus.textContent = "Nenhuma oficina encontrada.";
        toast.show("Nenhuma oficina encontrada.", "warning");
        return;
    }

    else
    {
        catalogStatus.textContent = `Oficinas encontradas: ${workshopsToRender.length}`;
        toast.show("Oficinas carregadas com sucesso.", "success");
    }

    if (state.selectedInstructorId) {
        workshopsToRender = workshopsToRender.filter(workshop => workshop.instructor.id === parseInt(state.selectedInstructorId));
        //atualiza a lista de workshops a renderizar com base no filtro de instrutor selecionado, convertendo o valor do filtro para inteiro para comparação com o ID do instrutor
        catalogStatus.textContent = `Oficinas encontradas: ${workshopsToRender.length}`;
    }

    if (state.term) {
        workshopsToRender = workshopsToRender.filter(
            workshop => workshop.title.toLowerCase().includes(state.term.toLowerCase())
        );
        catalogStatus.textContent = `Oficinas encontradas: ${workshopsToRender.length}`;
    }


    workshopList.innerHTML = "";

    workshopsToRender.forEach(workshop => {
        const card = document.createElement("article");

        card.innerHTML = `
            <h3>${workshop.title}</h3>
            <p>${workshop.getSummary()}</p>
            <button data-workshop-id="${workshop.id}">
                Ver ementa
            </button>
        `;
        const button = card.querySelector("button");
        button.addEventListener("click", () => showWorkshopDetail(workshop.id));
        
        workshopList.appendChild(card);
    });
}

function renderInstructors() {
    // TODO: transforme instructorData em Instructor e preencha o select.
    instructorFilter.innerHTML = '<option value="">Todos os instrutores</option>';
    instructors.forEach(instructor => {
        const option = document.createElement("option");
        option.value = instructor.id;
        option.textContent = instructor.getLabel();
        instructorFilter.appendChild(option);
    })
}

function showWorkshopDetail(workshopId) {
    // TODO: encontre a oficina e mostre sua ementa no painel.
    const workshop = workshopCatalog.findById(workshopId);
    if (workshop) {
        workshopDetail.innerHTML = `
            <h2>${workshop.title}</h2>
            <p>${workshop.description}</p>
            <p><strong>Instrutor:</strong> ${workshop.instructor.getLabel()}</p>
            <p><strong>Nível:</strong> ${workshop.level}</p>
            <p><strong>Duração:</strong> ${workshop.duration} minutos</p>
        `;
    }
}

function validateWorkshop(workshop) {

    if (!workshop || !workshop.title || !workshop.instructor) {
        toast.show("Erro: oficina inválida.", "error");
        return false;
    }

    toast.show("Oficina válida.", "success");
    return true;
}
console.log(validateWorkshop(workshops[0])); // true
console.log(validateWorkshop({})); // false

function initialize() {
    // TODO: crie as entidades, o catalogo e a primeira renderizacao.
    renderInstructors();
    renderWorkshops();
}

instructorFilter.addEventListener("change", () => {
    state.selectedInstructorId = instructorFilter.value;
    renderWorkshops();
});

workshopFilter.addEventListener("input", () => {
    state.term = workshopFilter.value;
    renderWorkshops();
});

workshopList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-workshop-id]");
    if (button) showWorkshopDetail(button.dataset.workshopId);
});

initialize();
