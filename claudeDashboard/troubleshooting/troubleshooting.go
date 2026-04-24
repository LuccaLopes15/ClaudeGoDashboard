package troubleshooting

import (
	"log"
	"os"
	"time"
)

func InitLogger() error {
	file, err := os.OpenFile("log.txt", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	log.SetOutput(file)
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)

	if err != nil {
		return err
	}
	return nil
}

func GerouErro(erro error, errorMessage string) (deuErro bool, mensagemErro string) {
	if erro != nil {
		horario := time.Now().Format("02/01/2006 15:04:05")
		mensagem := horario + " - " + errorMessage + "\n\n" + "Erro: " + erro.Error() + "\n"
		log.Print(mensagem)
		return true, mensagem
	}
	return false, ""
}
