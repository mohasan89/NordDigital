# **Тестовое заданние**

Приложение построено с использованием фреймворка _Next.JS_ и библиотек _React-Leaflet_ , _xml2js_

## **Backend**

Серверная часть считывает входной файл в _/data/Travel.xml_ и имеет две конечных точки.

- **GET** _/api/routes_: читать файл и вернуть идентификатор маршрута с помощью JS регулярное выражение, где идентификатор маршрута можно найти < route part="route\*id_string" > с помощью выражения /< route part="(.\*)">/g
  после очистки данных, результаты будут {routes: [id<sub>1</sub>, id<sub>2</sub>, ....... id<sub>n</sub>]}

  _ps_ этот шаг может быть выполнен с помощью xml2js для преобразования xml-файла в тип объекта с последующим получением атрибутов, но это может занять меньше памяти.

- **GET** _/api/routes/:id_: Этот запрос будет использовать route_id для извлечения данных из xml

  1. регулярное выражение используется для извлечения маршрута в виде текста,
  2. текст анализируется на объект с помощью xml2js
  3. данные очищаются, а значения _lat_, _long_ преобразуются в тип числа
  4. данные возвращаются в виде {route: { points: [ точка<sub>1</sub>, точка<sub>2</sub>, ...... точка<sub>n</sub> ] } }
     , где точка= {lat: number, long: number, name: string}

## Frontend

- при загрузке index.html приложение запросит _/api/routes_, чтобы иметь все доступные идентификаторы, которые сохраняются в состоянии для заполнения параметров ввода < select >.

- выбор используется в качестве _prop_ для компонента **LeafletMap**, которая будет использоваться для запроса _/api/маршрутов/route_id_

- точки используются для вычисления границ и сохраняются как состояние, которое будет использоваться для создания _Popup_, _Marker_ и _Polyline_

---

## используемые библиотеки:

- axios: _0.21.1_
- react-leaflet: _3.2.1_
- xml2js: _0.12.0_
