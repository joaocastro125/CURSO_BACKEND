const express=require('express');
const {uuid, isUuid}=require("uuidv4")

const app=express();

/**
 * GET-> BUSCA E FILTRAGEM -> http://localhost:3333/projects?name=joao
 * POST -> CRIAÇÃO E EDIÇÃO -> http://localhost:3333/projects
 * PUT -> ATUALIZAÇÃO -> http://localhost:3333/projetcs/1
 * DELETE-> EXCLUIR -> http://localhost:3333/projetcs/1
*/

/**
 * tipos de paramentros
 * query params -> filtragem e paginação
 * routes params -> identicação e atualização de recurso(atualizar/deletar)
 * body params
*/

/**
 * middleware :
 * interceptador de requisção ele pode interroper totalmente a requisição ou alterar dados requisição
*/

app.use(express.json());
const projects=[];
function logResquest(request,response,next){
    const {method,url}=request;
    const logLabel=`[${method.toUpperCase()} ] ${url}`;
    console.log(logLabel);
    return next();
}
function validateProjectId(request,response,next){
    const {id}=request.params;
    if(!isUuid(id)){
        return response.status(404).json({error:"Invalid project ID"});
    }
    return next();
}
app.use(logResquest)
app.get("/projects",(request, response)=>{
    const {title}=request.query;
    const results=title
    ? projects.filter(project =>project.title.include(title))
    : projects

    // console.log(title);
    // console.log(owner);
    return response.json(projects);
});

app.post("/projects",(request,response)=>{
    const {title,owner}=request.body
   const project={id:uuid(),title,owner};
   projects.push(project);
    return response.json(project);

});

app.put("/projects/:id",validateProjectId,(request,response)=>{
    const {id}=request.params;
    const {title,owner}=request.body;
    // procurar se existe uma informaçao no array faz uma verificaççao 
   const projectIndex=projects.findIndex(project=>project.id===id);
   if(projectIndex<0){
       return response.status(404).json({error:" Projects not found "});
   }
   const project={
       id,
       title,
       owner,
   }
   projects[projectIndex]=project;

    return response.json(project);
})

app.delete("/projects/:id",validateProjectId,(request,response)=>{
    const {id}=request.params;
    const projectIndex=projects.findIndex(project=>project.id===id);
    if(projectIndex<0){
        return response.status(404).json({error:" Projects not found "});
    };

   projects.splice(projectIndex,1);
    return response.status(204).send();
})




app.listen(3333,()=>console.log('running server'));