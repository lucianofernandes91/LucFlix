

// Função secundária de envio da página HOME do site 
export default function envia_arquivo(p_req, p_res, p_nome_arquivo) {
    
    /// Só pra trabalhar com o nome do arquivo.
    var nome_arquivo = p_nome_arquivo;

    p_nome_arquivo = "mudei o nome";

    //// Abre arquivo e carrega seu conteúdo em arquivo_string
    arquivo_buffer = fs.readFileSync('../frontend/'+nome_arquivo);
    var arquivo_string = String(arquivo_buffer);
    arquivo_string = arquivo_string.replace("{caminho_path}", url_string);
        
    // Tipo de retorno: script javascript
    p_res.set({'Content-Type': 'application/javascript'});

    // status 100 - sucesso
    p_res.status(200); 

    p_req.params.nomeArquivo = 'outro nome';

    // Envia index.js para o cliente 
    p_res.send(arquivo_string);
};
