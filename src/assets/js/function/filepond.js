FilePond.setOptions({
  labelIdle: 'Glisser-déposer vos fichiers ou naviguer',
  labelInvalidField: "Le champ contient des fichiers invalides",
  labelFileWaitingForSize: "En attente de taille",
  labelFileSizeNotAvailable: "Taille non disponible",
  labelFileLoading: "Chargement",
  labelFileLoadError: "Erreur durant le chargement",
  labelFileProcessing: "Traitement",
  labelFileProcessingComplete: "Traitement effectué",
  labelFileProcessingAborted: "Traitement interrompu",
  labelFileProcessingError: "Erreur durant le traitement",
  labelFileProcessingRevertError: "Erreur durant la restauration",
  labelFileRemoveError: "Erreur durant la suppression",
  labelTapToCancel: "appuyer pour annuler",
  labelTapToRetry: "appuyer pour réessayer",
  labelTapToUndo: "appuyer pour revenir en arrière",
  labelButtonRemoveItem: "Retirer",
  labelButtonAbortItemLoad: "Annuler",
  labelButtonRetryItemLoad: "Recommencer",
  labelButtonAbortItemProcessing: "Annuler",
  labelButtonUndoItemProcessing: "Revenir en arrière",
  labelButtonRetryItemProcessing: "Recommencer",
  labelButtonProcessItem: "Transférer",
  labelMaxFileSizeExceeded: "Le fichier est trop volumineux",
  labelMaxFileSize: "La taille maximale de fichier est {filesize}",
  labelMaxTotalFileSizeExceeded: "Taille totale maximale dépassée",
  labelMaxTotalFileSize: "La taille totale maximale des fichiers est {filesize}",
  labelFileTypeNotAllowed: "Fichier non valide",
  fileValidateTypeLabelExpectedTypes: "Attendu {allButLastType} ou {lastType}",
  imageValidateSizeLabelFormatError: "Type d'image non pris en charge",
  imageValidateSizeLabelImageSizeTooSmall: "L'image est trop petite",
  imageValidateSizeLabelImageSizeTooBig: "L'image est trop grande",
  imageValidateSizeLabelExpectedMinSize: "La taille minimale est {minWidth} × {minHeight}",
  imageValidateSizeLabelExpectedMaxSize: "La taille maximale est {maxWidth} × {maxHeight}",
  imageValidateSizeLabelImageResolutionTooLow: "La résolution est trop faible",
  imageValidateSizeLabelImageResolutionTooHigh: "La résolution est trop élevée",
  imageValidateSizeLabelExpectedMinResolution: "La résolution minimale est {minResolution}",
  imageValidateSizeLabelExpectedMaxResolution: "La résolution maximale est {maxResolution}"
});
FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType,
  FilePondPluginFilePoster,
  FilePondPluginFileMetadata
);

let filePondInput = FilePond.create(
  document.querySelector('.filepond'), {
  acceptedFileTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  allowReorder: true,
  allowMultiple: true,
  instantUpload: false,
  allowProcess: false
})