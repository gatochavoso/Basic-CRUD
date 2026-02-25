export function matchRoute(routePath, reqUrl) {
  // substitui os parametros da rota (ex: :id) por um grupo regex que aceita letras, numeros, underscore e hifen
  const regexPath = routePath.replace(/:(\w+)/g, "([\\w-]+)");
  // cria a regex garantindo que a URL começa e termina exatamente com o padrao da rota
  const regex = new RegExp(`^${regexPath}$`);

  return regex.test(reqUrl);
}
// extrai id da url
export function getIdFromUrl(url) {
    const [pathUrl] = url.split("?")
    const [, , id] = pathUrl.split("/")
    return id
}