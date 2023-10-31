#!/usr/bin/env python
# coding: utf-8

# In[1]:


# Tecnología
import pandas as pd
import os


# # Conversiones
# 
# Hay muchos valores pérdidos en la métrica conversiones. Y la tabla que tiene conversiones su tipo es objeto. Por tanto, descartar este objetivo.
# 
# Cuando se tenga un número asociado a esta métrica, una posible solución es separar un dataframe que contiene conversiones y otro que contiene impresiones y reach. Serán seleccionados en función de la selección que haga el usuario en el front

# In[2]:


# Get files path and names
path_directory = 'data/consolidate/'
list_path_files = os.listdir(path_directory)

# Concate all files in one dataframe
df = pd.DataFrame()
for file in list_path_files:
    path_file = path_directory + '/' + file
    df_iter = pd.read_csv(path_file)
    nodo = os.path.splitext(file)[0].split('_')[2]
    df_iter['nodos'] = nodo
    df = pd.concat([df, df_iter])

df.info()


# In[3]:


# Agregar costo por reach
df['cpreach'] = df.spend.div(df.reach)
col_sel = ['spend', 'reach', 'impressions', 'clicks', 'cpreach', 'cpm', 'cpc']
df[col_sel]


# In[8]:


# Agregar distancia entre dos puntos
def distancia_entre_2_puntos(x2, y2, x1, y1):
    distancia = (((x2 - x1)**2) + ((y2 - y1)**2))**(1/2)
    return distancia


# In[21]:


# Crear distancias

# distancia awareness
df['dist_awar'] = distancia_entre_2_puntos(0, df.impressions.max(), df.cpm, df.impressions)

# distancia reach
df['dist_reach'] = distancia_entre_2_puntos(0, df.reach.max(), df.cpreach, df.reach)

# distancia consideración, traffic, clicks
df['dist_cons'] = distancia_entre_2_puntos(0, df.clicks.max(), df.cpc, df.clicks)


# In[45]:


df[['dist_awar', 'dist_reach', 'dist_cons']]


# In[48]:


df[['dist_awar', 'dist_reach', 'dist_cons', 'clicks', 'cpc', 'spend']][df.dist_cons.isnull()]


# In[49]:


df[['dist_awar', 'dist_reach', 'dist_cons', 'clicks', 'cpc', 'spend']]


# In[23]:


import plotly.express as px
fig = px.scatter(df, y='reach', x='cpreach')
fig.show()


# In[18]:


# Generate dataframe for conversiones, use df for awareness and consideración
df_conv = df[~df.conversions.isna()]
df_conv.info()


# # Pregunta 1
# 
# ¿Cuál es el significados de los objetivos? ¿Se agruparán todos en las categorías REACH, AWARENESS, CONSIDERACION, CONVERSION?

# In[24]:


df['objective'].unique()


# In[25]:


dict_objetivos = {'AWARENESS':['OUTCOME_AWARENESS'],
                  'REACH': ['REACH'],
                  'CONSIDERACION':['LINK_CLICKS', 'OUTCOME_ENGAGEMENT', 'PAGE_LIKES', 'POST_ENGAGEMENT' ],
                  'CONVERSION':['CONVERSIONS', 'OUTCOME_SALES']}


# In[26]:


df['nodos'].unique()


# In[76]:


def seleccionar_imagenes(dfp, dict_objetivos, nodo, objetivo, nom_col_nodo, nom_col_obj, met_awar, met_reach, met_cons, cant_imagenes = 4):
    # Printing
    print('')
    print('Diccionario con objetivos y sus posibles valores: ', dict_objetivos)
    print('')
    print('Nodo: ', nodo)
    print('Objetivo: ', objetivo)
    print('Nombre columna nodo: ', nom_col_nodo)
    print('Nombre columna objetivo: ', nom_col_obj)
    print('Metrica awareness: ', met_awar)
    print('Metrica reach: ', met_reach)
    print('Metrica consideración: ', met_cons)
    print('Cantidad de imágenes: ', cant_imagenes)

    # Selección Nodo
    dfp = dfp.loc[(dfp[nom_col_nodo] == nodo)]

    # AWARENESS
    if pd.Series(objetivo).isin(dict_objetivos['AWARENESS']).values[0]:
        dfp = dfp[dfp[nom_col_obj].str.contains(objetivo)]
        dfp = dfp.sort_values(met_awar, ascending = True)
        dfp = dfp[0:cant_imagenes]
        return dfp
    
    # REACH
    elif pd.Series(objetivo).isin(dict_objetivos['REACH']).values[0]:
        dfp = dfp[dfp[nom_col_obj].str.contains(objetivo)]
        dfp = dfp.sort_values(met_reach, ascending = True)
        dfp = dfp[0:cant_imagenes]
        return dfp
    
    # CONSIDERACION, TRAFFIC, CLICKS
    elif pd.Series(objetivo).isin(dict_objetivos['CONSIDERACION']).values[0]:
        dfp = dfp[dfp[nom_col_obj].str.contains(objetivo)]
        dfp = dfp.sort_values(met_cons, ascending = True)
        dfp = dfp[0:cant_imagenes]
        return dfp
    


# In[81]:


# Valores

nodo = 'seguidores'
objetivo = 'REACH'
nombre_columna_nodo = 'nodos'
nombre_columna_objetivo = 'objective'
nombre_columna_imagenes = ''
nombre_columna_descripcion_imagen = ''
metrica_awar = 'dist_awar'
metrica_reach = 'dist_reach'
metrica_cons = 'dist_cons'
cantidad_imagenes = 6
seleccionar_imagenes(df, dict_objetivos, nodo, objetivo, nombre_columna_nodo, nombre_columna_objetivo, 
                     metrica_awar, metrica_reach, metrica_cons, cantidad_imagenes)

