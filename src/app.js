const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const {title, url, techs, likes } = request.body;
    Object.freeze(likes);
    const repoIndex = repositories.findIndex(repo => repo.id === id);
    if(repoIndex < 0){
      return response.status(400).json();
    }
    const repo = {
      id,
      title,
      url,
      techs,
      likes: repositories[repoIndex].likes
    }    

    repositories[repoIndex] = repo;
    return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const repoIndex = repositories.findIndex(repo => repo.id === id);
    if(repoIndex < 0){
      return response.status(400).json();
    }
    repositories.splice(repoIndex, 1);
    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find(repository => repository.id === id);
  if(!repository){
    return response.status(400).send();
  }
  repository.likes += 1;
  return response.json(repository);
});

module.exports = app;
