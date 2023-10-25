#Utilisation du modèle de données (infrastructure) dans le domaine métier"
Date : 24/10/2023

## Contexte
Nous avons pris la décision de nous baser sur l'objet de l'infrastructure **decision** pour notre choix technique.
L'API DbSder se base sur cet objet à la fois sur la partie **domain** et la partie **infrastructure** enregistré sur la base de données dbsder.
Notre équipe est consciente que ce choix ne soit pas en totale adéquation avec les principes de la Clean architecture, qui met en lumière les séparations entre domaine et infrastructure, nous tenons à rester pragmatique par rapport au besoin métier qui se prête à notre choix technique. 


## Décision
Notre API faisant passe plat, dans un souci de simplicité, conserve les mêmes noms de champs entre l'objet du domaine et le modèle de base de données dans l'infrastructure. 
C'est également dans le but de ne pas créer un mapping supplémentaire ou encore d'opérer une mauvaise traduction que nous conservons les mêmes attributs entre domaine et infrastructure.
Enfin, nous appuyons notre choix dans un souci de limiter l'impact sur nos utilisateurs qui utilisent encore ce modèle de données directement.
