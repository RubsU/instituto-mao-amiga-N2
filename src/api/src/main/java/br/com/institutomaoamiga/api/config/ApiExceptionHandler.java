package br.com.institutomaoamiga.api.config;

import br.com.institutomaoamiga.api.dto.ErroResponseDTO;
import br.com.institutomaoamiga.api.service.RecursoNaoEncontradoException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.data.mapping.PropertyReferenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;

// Transforma exceções em respostas 400 e 404 (e não 500)
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponseDTO> naoEncontrado(RecursoNaoEncontradoException ex) {
        return resposta(HttpStatus.NOT_FOUND, ex.getMessage(), List.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResponseDTO> dadosInvalidos(MethodArgumentNotValidException ex) {
        List<String> detalhes = ex.getBindingResult().getFieldErrors().stream()
                .map(erro -> erro.getField() + ": " + erro.getDefaultMessage())
                .toList();
        return resposta(HttpStatus.BAD_REQUEST, "Dados inválidos.", detalhes);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResponseDTO> corpoIlegivel(HttpMessageNotReadableException ex) {
        return resposta(HttpStatus.BAD_REQUEST, "Corpo da requisição ausente, mal formatado ou com tipo inválido.", List.of());
    }

    // um id que não é um UUID não pode existir: responde 404
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErroResponseDTO> parametroComTipoInvalido(MethodArgumentTypeMismatchException ex) {
        if ("id".equals(ex.getName())) {
            return resposta(HttpStatus.NOT_FOUND, "Registro não encontrado: " + ex.getValue(), List.of());
        }
        return resposta(HttpStatus.BAD_REQUEST, "Parâmetro inválido: " + ex.getName(), List.of());
    }

    // por exemplo, sort=campoQueNaoExiste
    @ExceptionHandler({PropertyReferenceException.class, InvalidDataAccessApiUsageException.class})
    public ResponseEntity<ErroResponseDTO> consultaInvalida(Exception ex) {
        return resposta(HttpStatus.BAD_REQUEST, "Parâmetros de consulta inválidos (confira o campo do sort).", List.of());
    }

    private ResponseEntity<ErroResponseDTO> resposta(HttpStatus status, String mensagem, List<String> detalhes) {
        return ResponseEntity.status(status).body(new ErroResponseDTO(status.value(), mensagem, detalhes));
    }
}
