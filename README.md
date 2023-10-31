# yenni_ad #


<p style="text-align:center;"><img align="center" src="1698636387045.png" alt="Yenni Logo" width="500" ></p>



<p style="text-align:center;">by: <img align="middle" src="1698725720710.png" alt="Ingenia2 Logo" width="175" >
</p>


#### En este repositorio puede encontrarse toda la información referente al desarrollo del proyecto de "Asistente de pauta para analistas de Mercadeo" conocido originalmente como "Recomendador imágenes a partir de métricas de plataformas de pauta" mediante el uso de Inteligencia Artificial Generativa. 
*Proyecto desarrollado en el marco de la Academia Bintec*


- [Contexto y overview](#contexto)

- [Arquitectura](#arquitectura)

- [Relevancia para el negocio](#relevancia-para-el-negocio)

- Pruebas unitarias

- Prevención de sesgos en el modelo

- Roles de los participantes y sus perfiles



## Contexto


Cada campaña y cada pieza publicitaria que termina publicada en algún medio, red social o plataforma tiene un montón de historia por detrás. En una combinación entre los analistas de mercadeo, los creativos de las agencias aliadas y los encargados de la última milla de la pauta en las plataformas, también aliados externos, pueden llegar a gastar hasta 2 semanas en ponerse de acuerdo en la pieza final.

Durante este periodo, se pueden ir hasta 5 horas en reuniones de seguimiento, en las que se itera sobre las piezas y se resuelven las diferencias creativas. Si consideramos que son más de 10 equipos diferentes, con al menos tres personas involucradas y que hay pauta permanentemente, podemos hacer un estimado en el que cada año invierten cerca de 39.000 horas.

Nuestra herramienta, mediante una interfaz amigable para los usuarios integra una solución punta a punta para disminuir esta inversión y mejorar el resultado final.

Basada en modelos de Inteligencia Artificial Generativa (GenAI), y de ahí su nombre, Yenni Adboom, asiste a los analistas de mercadeo para que la comunicación con el resto de aliados sea muhco más efectiva. Así, en vez de comunicar mediante una descripción textual lo que quisiera para las piezas gráficas de la campaña, ahora puede hacerlo mediante una imagen. Reza el viejo adagio que vale más una imagen que mil palabras. Esto es lo que logra Yenni.

La solución hace mucho más de lo que parece. Como primera medida, hace uso de la data histórica que se tiene del desempeño de las pautas, esto incluye no solo las piezas gráficas usadas sino sus atributos; como el objetivo de la campaña (awareness, tráfico o conversión), métricas como el número de clics, su alcance, su inversión, costo por clic, etc. Una descripción más detallada está disponible en el diccionario de datos de la tabla donde se centralizó toda la información.

Según las necesidades detectadas en conversaciones con los analistas de mercadeo encargados de la pauta, se tiene que una de las principales ventajas y diferenciadores sobre el proceso actual, es que el volumen de piezas y métricas es tan alto que es humanamente inviable revisar cómo fueron los desempeños para extraer insights valiosos para futuras campañas. Esto es algo en lo que uno de los analistas con quien tuvimos un espacio fue enfático. Según sus palabras: 

> "Meterse en plataformas es tedioso, demorado, comparar pieza por pieza no es algo que se haga ni por el lado del analista ni de la agencia. En un mes pueden ser más de 600 piezas, es imposible revisarlas todas" --S

Con este insumo como lo más importante, la herramienta incorpora modelos muy sofisticados:

De un lado ```clip_interrogator2``` que es capaz de generar una descripción muy completa de la composición de cada imagen, siendo incluso tolerante a las piezas que se encuentran dentro de las plantillas usadas en los distintos canales. Con esto logramos tener la composición y descripción de las imágenes históricas. Esta información se une a la tabla como un atributo adicional de la pieza.

Posteriormente el analista define cuál será el objetivo de la nueva campaña, el nodo al que pertenece (por ejemplo si es de tu360compras, wompi, etc) y una corta descripción de a lo que le apunta la campaña. 

En este punto, un algoritmo basado en reglas claras de negocio relacionadas con las mejores métricas para medir el éxito de una campaña de acuerdo a cada nodo y objetivo, encuentra en el histórico las piezas con el mejor desempeño para lo solicitado por el analista.

Acá entra en juego el siguiente gran modelo, un Large Language Model (LLM), que se encarga de unificar las descripciones de las imágenes seleccionadas en el paso anterior, darle el tono que el analista incluyó en la interfaz y generar una descripción que sirve de prompt para generar la imagen. Para este punto utilizamos ```llama2```, específicamente la versión ``TheBloke_Llama-2-13B-chat-GPTQ``, desarrollado por Meta y con una licencia gratuita y con un alcance amplio. Este modelo mostró tener un gran desempeño, según la investigación realizada, evitando así la necesidad de un modelo mucho más robusto y pesado como su versión de 70B.

Finalmente, el último gran modelo que utilizamos es el de ```Stable Diffusion XL 1.0```, un modelo de difusión latente (LDM por sus siglas en inglés) que de igual manera es de licencia abierta y que permite generar imágenes a partir de texto (dentro de muchas otras posibilidades que no incorporamos pero que podrían venir en un posterior desarrollo de Yenni).

Con este modelo se generan 4 imágenes diferentes a partir de la misma descripción que luego se le muestran al analista en la interfaz inicial, sin que tenga necesidad de saber lo que está pasando por debajo del capó y en la que puede escoger la o las que le parezcan pertinentes para transmitir la idea que tiene al resto de los involucrados.

De esta manera, la comunicación se hace mucho más efectiva y se espera reducir en un 50% la cantidad de horas necesarias para llegar a la pieza final, liberando estas horas para todas las otras tareas que a diario enfrentan los analistas y contribuyendo indirectamente a su bienestar.

[Volver al inicio](#yenni_ad)

-------------

## Arquitectura

El diagrama presentado a continuación resume la arquitectura, que se describe posteriormente:

![Descripción de la arquitectura del proyecto](architecture_yenni.png)


Esta arquitectura se compone de varios servicios de AWS que trabajan en conjunto para lograr orquestar de una manera eficiente, escalable y disponible los siguientes componentes:

1.	Recolector de datos

Este proceso de la arquitectura se encarga de recolectar, almacenar y disponibilizar los insumos necesarios, desde las diferentes plataformas de pauta web (Meta, X, LinkedIn, Google ads)
Los datos que se obtienen en este proceso son los siguientes:
•	Campañas
•	Anuncios
•	Metricas de los anuncios
•	Creatividades de los anuncios
•	Imágenes de los anuncios

**¿Como funciona?**

El Eventbridge tienen una regla configurada para que todos los días a las 7am ejecute una función Lambda.

La función Lambda consulta en la tabla “bookmark” de dynamoDB cuál fue la última fecha de ejecución exitosa para cada una de las plataformas y consume las API obteniendo los datos de los nuevos anuncios.

Se almacenan los datos en el bucket de S3 particionados por año, mes, dia, plataforma y cuenta publicitaria y se guarda el nuevo bookmark en la tabla de dynamoDB

En caso de que la función lambda arroje algún error durante la ejecución, se dispara un mensaje por correo electrónico mediante un topic de SNS al equipo IngenIA2.0 para su revisión y corrección.

El Crawler de GLUE se ejecuta todos los días a las 8:00am, identificando las nuevas particiones y los nuevos datos almacenados en el bucket de S3 y actualiza el Glue data Catalog para que pueda ser consumida la data fácilmente por los otros consumidores.


2.	Aplicación WEB

Sitio web estático desarrollado en REACT con el que interactuarán los usuarios de Yenni Ad.

**¿Como funciona?**

El sitio web estático  se almacena en el bucket de S3 y se distribuye por medio de Cloudfront.

La autenticación se gestiona por medio de los users groups de Cognito.

Api Gateway gestionará la comunicación entre el front y el back que en nuestro caso será una función Lambda.

La función lambda recibe los datos enviados desde el front (nodo, objetivo, y descripción de la audiencia) consume el Glue data Catalog para determinar cuáles son las imágenes vinculadas a los anuncios que mejores resultados tuvieron, de acuerdo a los datos ingresados y activa el endpoint de Sagemaker enviando el dataset resultante.

En caso de que la función lambda arroje algún error durante la ejecución, se dispara un mensaje por correo electrónico mediante un topic de SNS al equipo IngenIA2.0 para su revisión y corrección.



3.	Componente ML	

El endpoint de sagemaker es consumido por la función lambda y recibe los parametros necesarios para la ejecución de los diferentes modelos que arrojarán un array con al menos cuatro imágenes que serán la recomendación para el usuario.

Los resultados se almacenan en el bucket de S3 y se devuelven al front para que sean recibidos por el usuario.

-----------------


## Relevancia para el negocio


¿Cuál es nuestro mercado?

Los destinatarios principales de la solución son los analistas de mercadeo, quienes son los que construyen el documento que recoge las principales características de la futura campaña (conocido como brief) y lo comunican a las agencias creativas (beneficiarios secundarios), que generan una primera versión que luego de varias iteraciones termina con el resultado final. Son estos últimos quienes conectan la pieza con los encargados de las plataformas de pauta.

¿Qué costumbres tiene nuestro cliente interno de mercadeo?

Nuestro cliente genera una primera solicitud con las ideas esenciales que ha definido (brief). Posteriormente suele tener reuniones en las que se evalúa la pertinencia de ciertas licencias creativas y se realizan observaciones. Se generan varias iteraciones a partir de la realimentación y finalmente se deciden cuáles son las piezas definitivas.

Este proceso tiene mucha variación dependiendo de la complejidad de la pieza y la importancia jerárquica de la campaña de la que harán parte las piezas.


¿Qué necesidades tiene nuestro cliente?

- Poder transmitir de una manera más concreta la idea base para la campaña, basado en su conocimiento del negocio para que el creativo de la agencia lo pueda entender más fácil y evitar reprocesos.
- Que las observaciones que realizan los analistas en las reunines de seguimiento sean tenidas en cuenta por parte de las agencias.
- Poder analizar y tener en cuenta las piezas exitosas que se dieron en el histórico de las campañas y que son muchas y muy voluminosas como para hacerlo a mano.

¿Cuál es diferencial?

Actualmente no existe al interior del banco una solución que integre data histórica con generación de imágenes. También, la ventaja competitiva está dada por la facilidad de uso y la posibilidad de plasmar en imágenes las ideas, lo que se traduce en la facilidad para el cliente de transmitirlas de una manera más tangible, mediante el uso de algunas alternativas visuales de referencia.

¿Satisfacemos las necesidades?

Sí. El producto logra llegar a una propuesta base visual, que recoge la idea abstracta del analista. Esto ayuda a que sus observaciones sean más comprensibles. Adicionalmente incorpora la posibilidad de tener en cuenta el desempeño histórico de las campañas, para resaltar los elementos presentes en aquellas piezas que hayan sido las más exitosas de acuerdo con los objetivos que persiguen (awareness, consideración, conversión, etc) y sus respectivas métricas.

¿Cómo se llama el producto?

Inspirados por las siglas de la Generative AI, queriendo también darle un toque en español (IA en vez de AI) y considerando el tono descomplicado y amigable y la simplicidad en su uso, optamos por darle el nombre de Yenni Adboom, conocida también como Yenni Ad o simplemente como Yenni.

Este nombre busca también ser compatible con las nomenclaturas que usa el banco para sus herramientas, considerando por ejemplo a Sofy. Esto adicionalmente nos da la libertad para poder, bajo el mismo nombre, agregar a futuro funcionalidades que complementen a Yenni y la hagan la asistente virtual no solo de pauta sino de todo mercadeo.



Outline:


Overview de la solución. Incluye las preguntas y respuestas que habíamos desarrollado con la coach.
La relevancia de la funcionalidad para el negocio. Por qué es útil, qué genera. Énfasis en el tiempo qeu se ahorra, en tiempo de analista interno y tiempo de agencia, que a pesar de qe no se recuepra se maximiza, potencialmente cuántos usuarios ya nalistas se beneficiarían.





Descripción en palabras y junto con la representación gráfica de la solución.
Se incluye cómo fue el manejo de lso datos, es decir, cómo se llevaron los datos al modelo.


Se incluyen temas como la usabilidad, los distintos componentes, el alcance y futuros desarrollos. (Solidez metodológica)

Cómo se lidió con los sesgos? Error del modelo

Puebas unitarias si aplican.

UX del usuario (FRont) agregar el videodemo.


Cómo llegamos a la solución.

Los distintos roles y la distribución del trabajo.
Creativodad.
