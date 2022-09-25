// Something for date
const addZero = function(number) {
    return number < 10 ? "0" + number : number
  }
  const showDate = function(dateString) {
  const date = new Date(dateString);
  
    return `${addZero(date.getDate())}.${addZero(date.getMonth() + 1)}.${date.getFullYear()} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
  }
// Create to UI
const studentTemplate = document.querySelector("#student-template");
const renderStudent = (student) => {
    const {
        id,
        name: stName,
        lastName,
        mark, 
        markedDate
    } = student;
    const studentRow = studentTemplate.content.cloneNode(true);
    const studentId= studentRow.querySelector(".student-id");
    studentId.textContent = id;
    const studentName = studentRow.querySelector(".student-name");
    studentName.textContent = `${stName} ${lastName}`
    const studentMarkDate = studentRow.querySelector(".student-marked-date")
    studentMarkDate.textContent = showDate(markedDate);
    const studentMark = studentRow.querySelector(".student-mark")  
    const markPercent = Math.round(mark * 100 / 150)
    studentMark.textContent = `${markPercent}%`;

    
    const studentPass = studentRow.querySelector(".student-pass-status");
    if (markPercent >= 40) {
        studentPass.textContent = "Pass";
        studentPass.classList.add("bg-success")
    } else {
        studentPass.textContent = "Fail"
        studentPass.classList.add("bg-danger")

    }
    const delBtn = studentRow.querySelector(".student-delete");
    delBtn.setAttribute("data-student", id ) 
    const edtbtN  = studentRow.querySelector(".student-edit");
    edtbtN.setAttribute("data-student", id ) 
    return studentRow;
};

//Loop to UI
const studentTable = document.querySelector("#students-table");
const studentTableBody = document.querySelector("#students-table-body");
const elCount = document.querySelector(".count");

let showingStudents = students.slice();

const renderStudents = () => {
    let avgMark = document.querySelector(".text-end")
    let sum = 0;
    students.forEach((student) =>{
        sum += student.mark 
    })
    if (sum <= 0) {
        avgMark.innerHTML = `Average mark : 0 %`
    }
    else if (sum > 0){
        avgMark.innerHTML = `Average percent ${Math.round(sum * 100 / 150 / showingStudents.length)}%`
    }
    studentTableBody.innerHTML = "";
    elCount.textContent = `Count : ${showingStudents.length}`;
    const studentsFragment = document.createDocumentFragment();
    showingStudents.forEach((student) => {
         const studentRow = renderStudent(student);
         studentsFragment.append(studentRow);
    }
    )
    studentTableBody.append(studentsFragment)
} 
renderStudents()

const addStudentModelEl = document.querySelector("#add-student-modal") 
const addStudentModel = new bootstrap.Modal(addStudentModelEl) 

// Add student
const addForm = document.querySelector("#add-form")
addForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const element = e.target.elements;

    const firstName = element.name.value;
    const lastName = element.lastname.value;
    const markVale = +element.mark.value;

    if (firstName.trim() && lastName.trim() && markVale > 0 && markVale <= 150) {
        const newStudent = {
            id: Math.floor(Math.random() * 1000),
            name: firstName, 
            lastName: lastName,
            mark: markVale,
            markedDate: new Date().toISOString()
        }
        students.push(newStudent)
        localStorage.setItem("students", JSON.stringify(students));

        showingStudents.push(newStudent)
    }
    renderStudents(); 
    addForm.reset();
    addStudentModel.hide()
})

// Edit
const nameEdit = document.querySelector("#edit-name")
const lastNameEdit = document.querySelector("#edit-lastname")
const markEdit = document.querySelector("#edit-mark")
const editForm =  document.querySelector("#edit-form")
// Delete
studentTable.addEventListener("click", (evt) => {
    if(evt.target.matches(".btn-outline-danger")){
      const clickedBtn = +evt.target.dataset.student
      const clickedStudent = showingStudents.findIndex((student) => {
         student.id == clickedBtn
      })
      students.splice(clickedStudent, 1)
      showingStudents.splice(clickedStudent, 1)
     let items = localStorage.getItem("students")
     items =  students.filter(function(item){
        if(item.id !== students.id ){
        return item
     }
     })
     localStorage.setItem("students", JSON.stringify(students))
     renderStudents();
    }  
        else if (evt.target.matches(".btn-outline-secondary")){
        const clickedId = +evt.target.dataset.student;

        const ClikedIdStd = students.find(function(student){
            return student.id === clickedId
        })
        nameEdit.value = ClikedIdStd.name;
        lastNameEdit.value = ClikedIdStd.lastName;
        markEdit.value = ClikedIdStd.mark;
        editForm.setAttribute("data-editing-id", ClikedIdStd.id)
    }

})
renderStudents();

const editStudentModelEl = document.querySelector("#edit-student-modal")
const editStudentModel = new bootstrap.Modal(editStudentModelEl)

editForm.addEventListener("submit" , function(evt){
    evt.preventDefault();

    const editingId= +evt.target.dataset.editingId;

    const nameValue = nameEdit.value
    const lastNameValue = lastNameEdit.value
    const markValue = +markEdit.value
    if (nameValue.trim() && lastNameValue.trim() && markValue >= 0 && markValue <= 150 ) {
      let student =  {
            id: editingId,
            name: nameValue,
            lastName: lastNameValue,
            mark: markValue,
            markedDate: new Date().toISOString()
        }
       
        const editingItemIndex = students.findIndex(function(student){
            return student.id === editingId
        });
        const ShowItemIndex = showingStudents.findIndex(function(student){
            return student.id === editingId
        });
        students.splice(editingItemIndex, 1, student);
        showingStudents.splice(ShowItemIndex, 1, student);
        JSON.parse(localStorage.getItem("students")).find((editedStd) => {
            return student = editedStd
        })
        localStorage.setItem("students" , JSON.stringify(students))
        
        editForm.reset();
        editStudentModel.hide()
    }
 renderStudents()
})
   
const filterForm = document.querySelector(".filter")
filterForm.addEventListener("submit", (evt) => {
    evt.preventDefault()
    
    const sortValue = evt.target.elements.sortby.value;
    const  searchValue = document.querySelector("#search").value

    const markTo = document.querySelector("#to").value  
    const markFrom = document.querySelector("#from").value

    showingStudents = students.sort((a , b) => {
    switch (sortValue) {
        case "1":
            if (a.name > b.name) {
                return 1
            } else if (b.name > a.name){
                return -1
            } else {
                return 0
            }
            case "2":
                return b.mark - a.mark;
            case "3":    
                return a.mark - b.mark;
                case "4":
                return new Date(a.markedDate).getTime() - new Date(b.markedDate).getTime(); 
        default:
            break;}
        }).filter((student) => {

            const PercentStudent = Math.round(student.mark * 100 / 150) 

            const sdToandFrom = !markTo ? true : PercentStudent <= markTo
 
            const regExp = new RegExp(searchValue, 'gi')

            const names = `${student.name} ${student.lastName}`;

            return PercentStudent >= markFrom && sdToandFrom && names.match(regExp)

           
        })
       renderStudents()










// showingStudents = students.filter((student)=>{
//     
//     
//     
//     return markFrom >= PercentStudent && markTo <= PercentStudent && names.match(regExp)

// })
// filterForm.reset()
}
)


