---
layout: post
title:  "Using dataset freely available on Quandl"
date: 2018-07-13 07:50:30  #YYYY-MM-DD HH:MM:SS +/-TTTT;
categories: ['website development','data science']
tags: ['data science','machie learning','stock analysis']
published: True # True/False
images: []
video: "V8WGuaXlcl8" # youtube video id
type: "article"
author: 'narendra'
description:
---


#### Installation Quandl python package

There are two way to install quandl python package.

1. With `pip` or `conda install`
2. With package tar or GitHub

1. With `pip` or `conda install`

```bash
pip install quandl
```
or

If you are using python-3

```bash
pip3 install quandl
``` 

qunadl python package is compatible with python v2.7.x and v3.x+.

If you are using anaconda environment for python you can install quandl with

```bash
conda install quandl
```

2. With tar or GitHub

Download or clone quandl repo from github

```bash
git clone https://github.com/quandl/quandl-python.git
```

Select quandl veresion by checkout to a git tag

```bash
cd quandl-python
git checkout v3.3.0
```

Install quandl

```bash
python setup.py install
```

quandl is built on top of multipile python packages, to install via git repo or tar all the dependent packages must be installed else use `pip` installation method to install quandl with dependencies as well.


#### Authentication

The quandl python module is free but you need a Quandl API key in order to download data from quandl data repositories. To get API key, you will need to create a [Quandl account](https://www.quandl.com/users/login) and get API key.


#### Getting started with Quandl?

To start using `quandl` python module you need to import it and need to setup your API key to authenticate.

```python
import quandl

quandl.ApiConfig.api_key = "YOURAPIKEY"
```

#### Downloading the data into python

```python
import quandl

# Quandl API key
quandl.ApiConfig.api_key = "YOURAPIKEY"

# Quandl code of specific dataset
dataset_code = "EIA/PET_RWTC_D"		

# Time series data
data = quandl.get(dataset_code)

# Getting the data into numpy array
data = quandl.get(dataset_code, returns="numpy")

# Make a filtered time-series call

# To set start and end dates
data = quandl.get(dataset_code, start_date="2001-12-31", end_date="2005-12-31")

# To request specific columns
data = quandl.get(["NSE/OIL.1", "WIKI/AAPL.4"])

# To request the last 5 rows
data = quandl.get("WIKI/AAPL", rows=5)

```

#### Download an entire time-series dataset

Entire time series data can be downloaded.

```python
import quandl

# Quandl API key8
quandl.ApiConfig.api_key = "YOURAPIKEY"

# Quandl code of specific dataset
database = "ZEA"	

quandl.bulkdownload(database)
```

#### Preprocess Time series data

To preprocess data quandl provides some APIs like `collapse` that you can use to group the data according to `daily`, `weekly`, `monthly`, `quarterly`, `annual`

```python
data = quandl.get(dataset_code, collapse="monthly")
```

__NOTE:__ Some additional parameters to pass with get method.

* __dataset__: str or list, depending on single dataset usage or multiset usage Dataset codes are available on the Quandl website.
* __api_key__: Downloads are limited to 50 unless api_key is specified.
* __start_date, end_date__: Optional datefilers, otherwise entire dataset is returned.
* __collapse__: Options are daily, weekly, monthly, quarterly, annual.
* __transform__: Options are diff, rdiff, cumul, and normalize.
* __rows__: Number of rows which will be returned.
* __order__: Options are asc, desc. Default: `asc`.
* __returns__: specify what format you wish your dataset returned as, either `numpy` for a numpy ndarray or `pandas`. Default: `pandas`.



















