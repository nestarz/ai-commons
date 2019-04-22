const fs = require("fs-extra");
const glob = require("globby");
const jsYaml = require("js-yaml");

module.exports = function(api) {
  api.loadSource(async store => {
    const forms = store.addContentType({
      typeName: "Forms",
      route: "/forms/:slug"
    });
    (await glob("content/forms/**/*.yml")).map(file => {
      const form = jsYaml.load(fs.readFileSync(file, "utf8"));
      forms.addNode({
        id: form.id,
        fields: form
      });
    });
    const preambules = store.addContentType({
      typeName: "Preambules",
      route: "/preambules/:slug"
    });
    (await glob("content/preambules/**/*.yml")).map(file => {
      const preambule = jsYaml.load(fs.readFileSync(file, "utf8"));
      preambules.addNode({
        id: preambule.id,
        fields: preambule
      });
    });
    const disclamers = store.addContentType({
      typeName: "Disclamers",
      route: "/disclamers/:slug"
    });
    (await glob("content/disclamers/**/*.yml")).map(file => {
      const disclamer = jsYaml.load(fs.readFileSync(file, "utf8"));
      disclamers.addNode({
        id: disclamer.id,
        fields: disclamer
      });
    });
  });
};
