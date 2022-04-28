// Função secundária de envio da página HOME do site
module.exports = function envia_pagina_home(p_res) {
    fs.readFile('../frontend/index.html', (err, html_buffer) => {
        var html_string = String(html_buffer);
        html_string = html_string.replace("{caminho_path}", url_string);

        p_res.end(html_string);  
    });
}   


