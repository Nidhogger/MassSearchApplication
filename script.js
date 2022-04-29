let searchbtn = document.querySelector(".search-btn");
      let search = document.querySelector(".search-bar");
      
      function SearchImg() {
          let selection = JSON.parse(search.value);
        document.querySelector(".video-container").innerHTML = "";
          selection.forEach(function (selectionElement) {
              fetch(`https://danbooru.donmai.us/post_versions?commit=Search&search%5Bpost_id%5D=${selectionElement}`)
                  .then((response) => response.text())
                  .then((data) => {
                      let html = data;
                      let loop = true;
                      let Articles = [];
                      let Articles2 = [];
                      let Articles3 = [];
      
                      while (loop === true) {
                          let re = new RegExp("<article");
                          let re2 = new RegExp("</article>");
                          let articleone = html.search(re);
                          if (articleone === -1) {
                              loop = false;
                          } else {
                              let articlelast = html.search(re2);
                              let substring = html.substring(articleone, articlelast + 10);
                              Articles.push(substring);
                              html = html.replace(substring, "null");
                          }
                      }
      
                      Articles.forEach(function (e) {
                          let re = new RegExp('<img src="');
                          let re2 = new RegExp('" width=');
                          let articleone = e.search(re);
                          let articlelast = e.search(re2);
                          let substring = e.substring(articleone + 10, articlelast);
                          Articles2.push(substring);
                      });
        Articles3 = Organizacao(Articles2);
        Articles3.forEach(function (e) {
              let html = `<div id="${selectionElement}" class="post" style="background:url('${e}') no-repeat center; background-size:100% 100%;" draggable="true"><p>#${selectionElement}</p></div>`;
              document.querySelector(".video-container").innerHTML += html;
          });
                EventDrag();
                ArrayOrg();
                  });
          });
      }
      
      function Organizacao(e) {
          // começando do começo.
          // Essa parte do código faz um Array com todos os elementos que tem o Id demandado.
          let list1 = e;
          let list2 = [];
      
      
          //Essa parte remove elementos desnecessarios das URLs, e averigua se elas já estão na lista. as que já estão são colocadas em "repetidas".
          //aquelas que não estão repetidas são colocadas em "list2"
          for (let i = 0; i < list1.length; i++) {
              let fr = list1[i];
              let fg = list2.includes(fr);
              if (fg == true) {
      
              } else if (fg == false) {
                  list2.push(fr);
              }
          }
          return list2;
      
      }
      
      /*function alarm(){
        alert("test bem feito.");
      };*/
      
      searchbtn.addEventListener("click", SearchImg);
      
      /* Drag and Drop */
      
      function ContainerB(){
        
        let containers = [...document.querySelectorAll(".drop-container")];
        containers.forEach(container => {
        container.addEventListener('dragover', e => {
          e.preventDefault()
          let draggable = document.querySelector(".dragging")
          container.appendChild(draggable)
        })
      })
      }
      
      function EventDrag(){
        let draggables = [...document.querySelector(".video-container").querySelectorAll(".post")];
        draggables.forEach(draggable => {
          draggable.addEventListener("dragstart", () => {
            draggable.classList.add("dragging")
          })
          draggable.addEventListener("dragend", () => {
            draggable.classList.remove("dragging")
          })
        })
      }
      
      ContainerB();
      
      // Save function.
      
      function CallSave(){
        let Inputname = document.querySelector(".name").value;
        let imgInput = [...document.querySelector(".side-container").querySelectorAll(".post")];
        
        if(Inputname != "" && imgInput[0] != undefined){
          Save(Inputname, imgInput);
        }
      };
      
      function Save(name, img){
        let imgList = [];
        img.forEach(e => {
          imgList.push(e.getAttribute("id"));
        })
        
        let pastas = JSON.parse(localStorage.getItem("Pastas-salvas"));
        if(pastas === null){
          pastas = [];
        }
          
          let Pasta = {
          "Name": name,
          "Images": imgList
        }
          let list = combine (pastas,Pasta);
        localStorage.setItem("Pastas-salvas", JSON.stringify(list));
        ShowFolders();
          };
      
      let SAVbtn = document.querySelector("a.links");
      
      SAVbtn.addEventListener("click", CallSave);
      
      function nameExist (array,folder){
          for (id in array) {
              if(array[id].Name == folder.Name ){
                  return id;
              };
          }
          return -1;
      };
      
      
      function combine (array,folder){
          let folderId = nameExist(array,folder)
          if ( folderId > -1){
              array[folderId]["Images"] = Organizacao(array[folderId]["Images"].concat(folder.Images));
              return array
              
          }else{
              array.push(folder);
              return array;
          };
          
      };
      
      // organização
      
      function ArrayOrg(){
        let ids = [];
        let nodeid = [...document.querySelector(".video-container").querySelectorAll(".post")];
        nodeid.forEach(e => {
          let id = e.getAttribute("id");
          ids.push(id);
        });
      ids.sort((a, b) => a - b);
        ids.forEach(e => {
          let container = document.querySelector(".video-container");
          let o = "#\\3" + e[0] + " " + e.substring(1);
         let object = container.querySelector(o);
         container.appendChild(object);
        });
      }
      
      // mostrar as pastas.
      
      function ShowFolders(){
        let filters = document.querySelector(".filters");
        filters.innerHTML = ""
        let pastas = JSON.parse(localStorage.getItem("Pastas-salvas"));
        if(pastas === null){
          pastas = [];
        }
        pastas.forEach(e =>{
          let name = e.Name;
          console.log(name);
          filters.innerHTML += `<button class="filter-options">${name}</button>`;
        })
      }
      
      ShowFolders();