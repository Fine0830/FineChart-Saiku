# FineChart
d3.js visualize data for saiku-ui


Introduce the method

1、Scripts to the appropriate files


![image](https://github.com/Fine0830/FineChart/blob/master/imgs/file.png)

2、Modify index.html

Add the corresponding scripts

```
<script type="text/javascript" src="js/saiku/plugins/FineChart/d3.js"></script>
<script type="text/javascript" src="js/saiku/plugins/FineChart/d3-dispatch.js"></script>
<script type="text/javascript" src="js/saiku/plugins/FineChart/d3-cloud.js"></script>
<script type="text/javascript" src="js/saiku/plugins/FineChart/d3.tip.js"></script>
<script type="text/javascript" src="js/saiku/plugins/FineChart/plugins.js"></script>

```
Add  the appropriate li tags in template-query-toolbar
```
<ul class='options chart hide'>
            <li class="seperator_vertical"><a href ="#export_button"
                class="disabled_toolbar export_button menu button"><span class="i18n">Export</span><span class="dropdown"></span></a></li>
            <li><a href="#bar"
                class="i18n bar chartoption button disabled_toolbar"
                title="Bar"></a></li>
            <li><a href="#stackedBar"
                class="i18n stackedBar chartoption on button disabled_toolbar"
                title="Stacked Bar"></a></li>
            <li><a href="#stackedBar100"
                class="i18n stackedBar100 chartoption button disabled_toolbar"
                title="Bar 100%"></a></li>
            <li><a href="#multiplebar"
                class="i18n multiple chartoption button disabled_toolbar"
                title="Multiple Bar Chart"></a></li>
            <li><a href="#line"
                class="i18n line chartoption button disabled_toolbar"
                title="Line"></a></li>
            <li><a href="#area"
                class="i18n area chartoption button disabled_toolbar"
                title="Area"></a></li>
            <li><a href="#heatgrid"
                class="i18n heatgrid chartoption button disabled_toolbar"
                title="Heat Grid"></a></li>
            <li><a href="#treemap"
                class="i18n treemap chartoption button disabled_toolbar"
                title="Tree Map"></a></li>
            <li><a href="#sunburst"
                class="i18n sunburst chartoption button disabled_toolbar"
                title="Sunburst"></a></li>
            <li><a href="#multiplesunburst"
                class="i18n multiplesunburst chartoption button disabled_toolbar"
                title="Multi Sunburst"></a></li>
            <li><a href="#dot"
                class="i18n dot chartoption button disabled_toolbar"
                title="Dot"></a></li>
            <li><a href="#waterfall"
                class="i18n waterfall chartoption button disabled_toolbar"
                title="Waterfall"></a></li>
            <li><a href="#pie"
                class="i18n pie chartoption button disabled_toolbar"
                title="Pie"></a></li>
			<li><a href="#bubble"
                class="i18n bubble chartoption button disabled_toolbar"
                title="bubble">Bubble</a></li>
			<li><a href="#scattermap"
                class="i18n bubble chartoption button disabled_toolbar"
                title="scattermap">scattermap</a></li>
            <li><a href="#wordcloud"
                class="i18n wordcloud chartoption button disabled_toolbar"
                title="wordcloud">wordcloud</a></li>
            <!--<li><a href="#chart_editor"
                class="i18n custom_chart button disabled_toolbar"
                title="Custom">Custom</a></li>-->
        </ul>

```

3、Replace script of SaikuChartRenderer.js

4、 It's ok.

![image](https://github.com/Fine0830/FineChart/blob/master/imgs/bubble1.png)

![image](https://github.com/Fine0830/FineChart/blob/master/imgs/scatterMap1.png)

![image](https://github.com/Fine0830/FineChart/blob/master/imgs/iWords.png)

