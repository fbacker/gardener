export default function fetchRun(url){

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Accept', 'application/json; charset=utf-8');

    var request = new Request(url, {
        headers: myHeaders,
        mode: 'cors',
        cache: 'no-cache',
        method: 'GET',
    });
    return fetch(request).then(result => {
      if(result.status===500){
        throw result;
      }
      return result;
    });
}
