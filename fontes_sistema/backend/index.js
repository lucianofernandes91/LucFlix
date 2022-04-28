const express = require('express');
const app = express();
 
const fs = require('fs');

const {fds} = require('./funcoes_do_sistema').default;
const fds2 = require('./fds2');

// Pega url do ambiente atual (dev/Producao/Testes etc.)
const url_buffer = fs.readFileSync('../../endereco_ip_ou_dns_e_porta.inf');
const url_string = String(url_buffer);

function envia_pagina_home2(p_res) {
    fs.readFile('../frontend/index.html', (err, html_buffer) => {
        var html_string = String(html_buffer);
        html_string = html_string.replace("{caminho_path}", url_string);

        p_res.end(html_string);  
    });
}   

// HOME
app.get('/', (req, res) => {  

    /// Página Principal - HOME (index.html)  
    envia_pagina_home2(res); 
});
  
// Arquivos secundários do frontend (scripts, css etc.)
app.get('/arquivos/:nomeArquivo', (req, res) => {

    /// Função principal. Envia o arquivo solicitado
    fds.envia_arquivo(req,res,req.params.nomeArquivo);
});


function envia_video_por_stream(p_req, p_res) {

    const arquivo_filme = p_req.params.arquivo_filme;
    const path_arquivo_filme = '../../videos/' + arquivo_filme;

    console.log('Playing ' + arquivo_filme);

    fs.stat(path_arquivo_filme, (err, statt) => {
        if (err) {
            console.log(err);
            return res.status(404).end('<h1>Filem não encontrado</h1>');
        }
        // Variáveis necessárias para montar o chunk header corretamente
        const faixa    = p_req.headers.range;

        const tamanho  = statt.size;

        var inicio = (faixa || '');
        inicio = iniciio.replace(/bytes=/, '');
        inicio = inicio.split('-');
        inicio = Number(inicio[0]);

        const fim = tamanho - 1;
        const tamanho_da_parte = (fim - inicio) + 1;
        // Definindo headers de chunk
        res.set({
            'Content-Range': 'bytes ' + iniciio + '-' + fim + '/' + tamanho,
            'Accept-Ranges': 'bytes',
            'Content-Length': tamanho_da_parte,
            'Content-Type': 'video/mp4'
        });
        // É importante usar status 206 - Partial Content para o streaming funcionar
        res.status(206);

        // Utilizando ReadStream do Node.js
        // Ele vai ler um arquivo e enviá-lo em partes via stream.pipe()
        const stream = fs.createReadStream(path_arquivo_filme, { inicio, fim });
        stream.on('open', () => stream.pipe(res));
        stream.on('error', (streamErr) => res.end(streamErr));
    });
}

// API que retorna vídeo a ser 'streemado' 
app.get('/videos/:arquivo_filme', (req, res) => { 
    envia_video_por_stream(req,res);
});

app.listen(80, () => console.log('Servior LucFlix rodando em: ' + url_string));




//////////////////////////////////////////////////////////////////
// FUNCTION ENVIA_VIDEO_STREAMING(arquivo_para_stream, reQ, res) //
/////////////////////////////////////////////////////////////////
// ENTRADA: ATENÇÃO!!! FUNCIONA EM CONJUNTO COM EXPRESS.JS !!!
// -- arquivo (path) a ser enviado;
// -- 'req' e 'res' vindos da rota (GET) do Express.
//
// DESCRIÇÃO:
// - Recebe nome do arquivo de vídeo (path completo) e os parâmetros req/res da rota chamada no express e
//   Envia tal arquivo pra quem o requisitou (req, res).
//
// EXEMPLO DE USO:
//
// app.get('/starwars'), (req, res) => {
//     envia_video_streaming('c:\star_wars_735354.mp4', req, res);
// }
//
/*
function envia_video_streaming(req, res) {
//
}

  
    // Funcção secundária para gerar erro em caso de falha
    function gera_erro(err) {
        console.log(err);
        return res.status(404).end('<h1>Video não encontrado.</h1>');
    }

    // Função secundária final - enviar o vídeo via streaming
    function envia_stream(arquivo_de_video) {
        // Variáveis necessárias para montar o chunk header corretamente
        const range = req.headers.range;
        console.log(range);
        const size = fs.Stats.size;
        console.log(range);
        const start = Number((range || '').replace(/bytes=/, '').split('-')[0]);
        console.log(range);
        const end = size - 1;
        console.log(range);
        const chunkSize = (end - start) + 1;
        console.log(range); 

        
        // Definindo headers de chunk
        res.set({
            'Content-Range': `bytes ${start}-${end}/${size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4'
        });

        // É importante usar status 206 - Partial Content para o streaming funcionar
         res.status(206);
         // Utilizando ReadStream do Node.js
         // Ele vai ler um arquivo e enviá-lo em partes via stream.pipe()
         const stream = fs.createReadStream(arquivo_de_video, { start, end });
         stream.on('open', () => stream.pipe(res));
         stream.on('error', (streamErr) => res.end(streamErr));
    };

    // Rotina Principal
    /// Checa se o arquivo existe
    fs.stat(arquivo_para_stream, (err, stats) => {
        if (err) {
            //// Erro, se o arquivo não existe.
            gera_erro(err);
        } else {
            //// Se existe, envia arquivo como stream.
            envia_stream(arquivo_para_stream);
        }
    }); */


    /* 
    /// Função secundária - Preparo e envio do arquivo de vídeo    
    function envia_video() { 

        //// Chamada da função principal de envio do vídeo
        envia_video_streaming(req, res);
    }

    /// Rotina Principal do método "GET /videos/:nomeVideo"
    envia_video(); */
