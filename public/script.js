let online  = " ";


    fetch("/onload", {
        method: 'POST'
    })
        .then(response => response.json()) // parse the JSON from the server
        .then(entries => {
            online = entries.uname;
        });

