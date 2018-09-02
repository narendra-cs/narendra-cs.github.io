---
layout: post
title:  "Step By Step Installation of Hadoop 3.x in Pseudo Distributed Mode on Single Node Cluster"
date: 2018-09-02 07:50:30
categories: ['Big Data','Hadoop']
tags: ['Big Data','Hadoop','YARN','HDFS','Hadoop 3','Hadoop 3 in Pseudo Distributed Mode']
published: True
images: ['p1_main.png']
type: "article"
author: "Narendra Singh"
description: "Release of Hadoop 3 has came with many advance enhancement over previous hadoop i.e. hadoop-2 . The Hadoop framework is at the core of the entire Hadoop ecosystem, and various other libraries strongly depend on it. So here is a article to install latest hadoop 3.x on linux ubuntu machine. "
---


> In this article, We will discuss about to steup our own hadoop single node cluster. Follow article step by step and enjoy working on newely updated hadoop framework for big data analytics and storage.

### Prerequisite

Before we begin with the installation of hadoop framework, we must need to prepare a linux base machine to install hadoop. So here is the prerequisites for hadoop installation.

#### 1. A Linux based machine that have following environment

* Set a hostname instead localhost ( nn.example.com )

```sh
$ sudo vi /etc/hostname

nn.example.com
```

![set hostname]({{site.baseurl}}/assets/img/post/p1_set_hostname.png)

* Map hostname to ip (Mine is 10.235.14.188)

```sh
$ sudo vi /etc/hosts

10.235.14.188 nn.example.com
```

![Map Ip]({{site.baseurl}}/assets/img/post/p1_set_host_mapping.png)

__Note:__ If you are not connected to a network use loopback ip (127.0.0.1)

* Create a new group and add a new user to it ( this user is to perform the admin tasks of hadoop )

```sh
$ sudo groupadd hadoop
$ sudo adduser --ingroup hadoop hduser
```

![Add User]({{site.baseurl}}/assets/img/post/p1_adduser.png)

Newly created user require necessary root privileges for custom file installation and running hadoop daemons that listen on tcp/ip port. To do so we have to make hduser a sudoer by making a entry of hduser in sudoer file or add hduser in sudo group.

```sh
$ sudo adduser hduser sudo
```

![Sudoer User]({{site.baseurl}}/assets/img/post/p1_make_hduser_sudoer.png)

Or

```sh
$ sudo visudo

hduser ALL=(ALL:ALL) ALL
```

__Note:__ With `visudo` command `/etc/sudoers` file will open in vi, a command line editor. To edit a file in vi, you have to enter into insert mode ( `press i` ) then type above line and exit insert mode ( `press esc` ), Now save and exit with `:wq` or `:x`.

So, Now our new user is created, lets switch to it and process further to install hadoop framework.

```sh
$ su - hduser
```

* Setup password less ssh within same system for hduser

Now check that you can ssh to the `nn.example.com` without a passphrase:

```sh
$ ssh nn.example.com
```

If you can not connect to `nn.example.com` via ssh without a passphrase, execute the following commands:

```sh
$ ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
$ cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
$ chmod 0600 ~/.ssh/authorized_keys
```

Try again to connect. This time it should not ask for password if it's asking remove `~/.ssh` directory in home of hduser and do above step again.

```sh
$ ssh nn.example.com
```
![Ssh Key Setup]({{site.baseurl}}/assets/img/post/p1_ssh_key_setup.png)

* Disable firewall and selinux 

```sh
$ sudo systemctl disable firewalld
$ sudo systemctl stop firewalld

$ setenforce 0
```

#### 2. JDK Installation 

* Download jdk8u181

```sh
$ wget --no-check-certificate --no-cookies - --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u181-b13/96a7b8442fe848ef90c96a2fad6ed6d1/jdk-8u181-linux-x64.tar.gz
```

* Extract jdk tar ball at installation directory

```bash
$ export INSTALL_DIR=/opt
$ sudo tar xzf jdk-8u181-linux-x64.tar.gz -C $INSTALL_DIR
```

* Set environment variables

Replace `$INSTALL_DIR` with it's value and Write following in a file named `jdk1.8.0_181.sh` and move it to `/etc/profile.d` directory.

```sh
$ vi jdk1.8.0_181.sh

#!/bin/sh

JAVA_HOME=$INSTALL_DIR/jdk1.8.0_181
JDK_HOME=$JAVA_HOME
JRE_HOME=$JAVA_HOME/jre
PATH=$JDK_HOME/bin:$JRE_HOME/bin:$PATH
LD_LIBRARY_PATH=$JDK_HOME/lib:$JDK_HOME/amd64:$JDK_HOME/amd64/jli:$JRE_HOME/lib:$JRE_HOME/lib/amd64:$JRE_HOME/lib/amd64/server:$JRE_HOME/lib/amd64/server/jli:$LD_LIBRARY_PATH
LIBRARY_PATH=$JDK_HOME/lib:$JDK_HOME/amd64:$JDK_HOME/amd64/jli:$JRE_HOME/lib:$JRE_HOME/lib/amd64:$JRE_HOME/lib/amd64/server:$JRE_HOME/lib/amd64/server/jli:$LIBRARY_PATH
INCLUDE=$JDK_HOME/include:$JDK_HOME/include/linux:$INCLUDE
C_INCLUDE_PATH=$JDK_HOME/include:$JDK_HOME/include/linux:$INCLUDE
MANPATH=$JDK_HOME/man:$MANPATH

$ sudo mv jdk1.8.0_181.sh /etc/profile.d/
```

![jdk installation]({{site.baseurl}}/assets/img/post/p1_jdk_installation.png)

Close terminal, open it again and check java version

```sh
$ java -version
```

![java version]({{site.baseurl}}/assets/img/post/p1_java_version.png)

### Apache Hadoop Installation and Configuration in Pseudo distribued mode

* Download apache hadoop tar 

```sh
wget http://www-us.apache.org/dist/hadoop/common/hadoop-3.0.3/hadoop-3.0.3.tar.gz
```

* Extract it in installation directory (`/opt`)

```sh
$ sudo tar xzf hadoop-3.0.3.tar.gz -C $INSTALL_DIR
```

* Create link of hadoop to hadoop-3.0.3. Also change ownership to hduser:hadoop and permission to 755

```
$ cd $INSTALL_DIR
$ sudo ln -s hadoop-3.0.3 hadoop
$ sudo chown -R hduser:hadoop hadoop-3.0.3
$ sudo chmod -R 755 hadoop-3.0.3
```
![extract hadoop tar]({{site.baseurl}}/assets/img/post/p1_extract_hadoop_tar.png)

* Set some envrionment variable ( For all users from you want to access hadoop )

Replace `$INSTALL_DIR` with it's value, write following in a file named `hadoop.sh` and move it to `/etc/profile.d` directory.

```sh
$ sudo vi hadoop.sh

#!/bin/sh

export HADOOP_HOME=$INSTALL_DIR/hadoop
export HADOOP_INSTALL=$HADOOP_HOME
export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
export HADOOP_OPTS="$HADOOP_OPTS -Djava.library.path=$HADOOP_HOME/lib/native "
export HADOOP_CLASSPATH=$HADOOP_HOME/share/hadoop/common
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_CLASSPATH
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
export HADOOP_MAPRED_HOME=$HADOOP_HOME
export HADOOP_COMMON_HOME=$HADOOP_HOME
export HADOOP_HDFS_HOME=$HADOOP_HOME
export YARN_HOME=$HADOOP_HOME
export HADOOP_LOG_DIR=/run/log/hadoop
export HADOOP_PID_DIR=/run/hadoop/pids 
export LD_LIBRARY_PATH=$HADOOP_COMMON_LIB_NATIVE_DIR:$LD_LIBRARY_PATH

$ sudo mv hadoop.sh /etc/profile.d/
```
![hadoop env]({{site.baseurl}}/assets/img/post/p1_hadoop_env1.png)

* Hadoop Admin (hduser) environment variable ( only for hadoop admin user hduser ) 

```sh
$ vi ~/.bashrc

export JAVA_HOME=/opt/jdk1.8.0_181
export PATH=$HADOOP_HOME/sbin:$PATH
```

Close terminal and open again to effect env variables.

* Create directory hierarchy for NameNode, DataNode and SecondaryNameNode

```sh
$ sudo mkdir -p /home/hdfs/{namenode,datanode,secondarynamenode}
$ sudo chown -R hduser:hadoop /home/hdfs
$ sudo chmod -R 700 /home/hdfs

$ sudo mkdir -p /run/log/hadoop
$ sudo touch /run/log/hadoop/hadoop.log
$ sudo chmod -R 2777 /run/log

$ sudo mkdir -p /run/hadoop/pids
$ sudo chown -R hduser:hadoop /run/hadoop
$ cd $HADOOP_CONF_DIR
```
![dfs_dicrtory_structure]({{site.baseurl}}/assets/img/post/p1_dfs_directory_structure.png)

* Edit `hadoop-env.sh` and replace `JAVA_HOME` value to `/opt/jdk1.8.0_181`

```
export JAVA_HOME=/opt/jdk1.8.0_181
export HADOOP_HOME=/opt/hadoop
export HADOOP_CONF_DIR=${HADOOP_HOME}/etc/hadoop
export HADOOP_LOG_DIR=/run/log/hadoop

export HADOOP_DAEMON_ROOT_LOGGER=INFO,RFA

export HADOOP_SECURITY_LOGGER=INFO,NullAppender
```

![hadoop-env.sh]({{site.baseurl}}/assets/img/post/p1_hadoop_env_sh.png)


* Edit `core-site.xml` in `$HADOOP_CONF_DIR` (Place following between `<configuration> </configuration>`)

```
	<property>
	<name>fs.defaultFS</name>
	<value>hdfs://nn.example.com:9000</value>
	</property>

	<property>
	<name>io.file.buffer.size</name>
	<value>131072</value>
	</property>
```
![core-site.xml]({{site.baseurl}}/assets/img/post/p1_core-site-xml.png)

* Edit `hdfs-site.xml` in `$HADOOP_CONF_DIR` (Place following between `<configuration> </configuration>`)

```
	<property>
	<name>dfs.namenode.name.dir</name>
	<value>file:/home/hdfs/namenode</value>
	</property>

	<property>
	<name>dfs.datanode.data.dir</name>
	<value>file:/home/hdfs/datanode</value>
	</property>

	<property>
	<name>dfs.namenode.checkpoint.dir</name>
	<value>file:/home/hdfs/secondarynamenode</value>
	</property>

	<property>
	<name>dfs.replication</name>
	<value>1</value>
	</property>

	<property>
	<name>dfs.blocksize</name>
	<value>128m</value>
	</property>

	<property>
	<name>Dfs.datanode.data.dir.perm</name>
	<value>700</value>
	</property>

	<property>
	<name>dfs.permissions.enabled</name>
	<value>true</value>
	</property>
```

9. Edit `mapred-site.xml` in `$HADOOP_CONF_DIR` (Place following between `<configuration> </configuration>`)

```
	<property>
	<name>mapreduce.framework.name</name>
	<value>yarn</value>
	</property>

	<property>
	<name>yarn.app.mapreduce.am.staging-dir</name>
	<value>/tmp/hadoop-yarn/staging</value>
	</property>

	<property>
	<name>mapreduce.am.max-attempts</name>
	<value>2</value>
	</property>

        <property>
        <name>yarn.app.mapreduce.am.env</name>
        <value>HADOOP_MAPRED_HOME=/opt/hadoop</value>
        </property>

        <property>
        <name>mapreduce.map.env</name>
        <value>HADOOP_MAPRED_HOME=/opt/hadoop</value>
        </property>

        <property>
        <name>mapreduce.reduce.env</name>
        <value>HADOOP_MAPRED_HOME=/opt/hadoop</value>
        </property>

        <property>
        <name>mapreduce.application.classpath</name>
        <value>$HADOOP_MAPRED_HOME/share/hadoop/mapreduce/*,$HADOOP_MAPRED_HOME/share/hadoop/mapreduce/lib/*,$HADOOP_MAPRED_HOME/share/hadoop/common/*,$HADOOP_MAPRED_HOME/share/hadoop/common/lib/*,$HADOOP_MAPRED_HOME/share/hadoop/yarn/*,$HADOOP_MAPRED_HOME/share/hadoop/yarn/lib/*,$HADOOP_MAPRED_HOME/share/hadoop/hdfs/*,$HADOOP_MAPRED_HOME/share/hadoop/hdfs/lib/*</value>
        </property>

	<property>
	<name>mapreduce.jobhistory.address</name>
	<value>nn.example.com:10020</value>
	</property>

	<property>
	<name>mapreduce.jobhistory.webapp.address</name>
	<value>nn.example.com:19888</value>
	</property>

	<property>
	<name>mapreduce.jobhistory.intermediate-done-dir</name>
	<value>/mr-history/tmp</value>
	</property>

	<property>
	<name>mapreduce.jobhistory.done-dir</name>
	<value>/mr-history/done</value>
	</property>
```

* Edit `yarn-site.xml` in `$HADOOP_CONF_DIR`

```
	<property>
	<name>yarn.resourcemanager.hostname</name>
	<value>nn.example.com</value>
	</property>

	<property>
	<name>yarn.resourcemanager.address</name>
	<value>${yarn.resourcemanager.hostname}:8032</value>
	</property>

	<property>
	<name>yarn.resourcemanager.scheduler.address</name>
	<value>${yarn.resourcemanager.hostname}:8030</value>
	</property>

	<property>
	<name>yarn.resourcemanager.webapp.address</name>
	<value>${yarn.resourcemanager.hostname}:8088</value>
	</property>

	<property>
	<name>yarn.resourcemanager.webapp.https.address</name>
	<value>${yarn.resourcemanager.hostname}:8090</value>
	</property>

	<property>
	<name>yarn.resourcemanager.resource-tracker.address</name>
	<value>${yarn.resourcemanager.hostname}:8031</value>
	</property>

	<property>
	<name>yarn.resourcemanager.admin.address</name>
	<value>${yarn.resourcemanager.hostname}:8033</value>
	</property>

	<property>
	<name>yarn.nodemanager.webapp.address</name>
	<value>${yarn.resourcemanager.hostname}:8042</value>
	</property>

	<property>
	<name>yarn.nodemanager.aux-services</name>
	<value>mapreduce_shuffle</value>
	</property>

	<property>
	<name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
	<value>org.apache.hadoop.mapred.ShuffleHandler</value>
	</property>

	<property>
	<name>yarn.nodemanager.log-dirs</name>
	<value>/run/log/yarn/userlogs</value>
	</property>

	<property>
	<name>yarn.nodemanager.log.retain-seconds</name>
	<value>10800</value>
	</property>

	<property>
	<name>yarn.nodemanager.remote-app-log-dir</name>
	<value>/logs</value>
	</property>

	<property>
	<name>yarn.nodemanager.remote-app-log-dir-suffix</name>
	<value>log</value>
	</property>
```

* Format the filesystem:

```sh
$ hdfs namenode -format
```
![hadoop env]({{site.baseurl}}/assets/img/post/p1_namenode_format.png)
	
__NOTE:__ If formatting namenode second or more time, it will give you error. so delete all files and directory in namenode, datanode and secondarynamenode directory.

```sh
$ rm -rf /home/hdfs/namenode/*
$ rm -rf /home/hdfs/datanode/*
$ rm -rf /home/hdfs/secondarynamenode/*
```
Then format namenode

```sh
$ hdfs namenode -format
```

* Start NameNode daemon and DataNode daemon:

```sh
$ start-dfs.sh
```
The hadoop daemon log output is written to the `$HADOOP_LOG_DIR` directory 


* Start ResourceManager daemon and NodeManager daemon:

```sh
$ start-yarn.sh
```

__NOTE:__ You can start all ( NameNode, DataNode, ResourceManager and NodeManager ) daemon with one command 

```sh
$ start-all.sh
```

If password less ssh not setup all command to start any daemons will ask for password.

* Start History server

```sh
$ mapred --daemon start historyserver
```

![start-daemons]({{site.baseurl}}/assets/img/post/p1_start-daemons.png)

* check hadoop daemons

```sh
$ jps
```

![daemons_check]({{site.baseurl}}/assets/img/post/p1_daemons_check.png)

* Make Required HDFS directories

```sh
$ hdfs dfs -mkdir -p /tmp/hadoop-yarn/staging/history/done_intermediate
$ hdfs dfs -chmod 1775 /tmp
$ hdfs dfs -chmod -R 777 /tmp/hadoop-yarn
$ hdfs dfs -mkdir /logs
$ hdfs dfs -chmod 1775 /logs
$ hdfs dfs -mkdir -p /mr-history/{tmp,done}
$ hdfs dfs -chmod -R 1775 /mr-history/tmp
$ hdfs dfs -chmod -R 750 /mr-history/done
```
![hdfs_dicrecotries]({{site.baseurl}}/assets/img/post/p1_hdfs_dicrecotries.png)

* Make the HDFS directories required for user to execute MapReduce jobs ( like a home directory in hdfs):

```sh
$ hdfs dfs -mkdir -p /user/<username>
```

### Check daemons status on web ui

- __NameNode:__				http://nn.example.com:9870
- __ResourceManager:__ 			http://nn.example.com:8088
- __MapReduce JobHistory Server:__ 	http://nn.example.com:19888 


__NOTE:__ For every user from which you want to use hadoop, use floowing step (do it with hadoop admin user `hduser` )

	
	1. Create HDFS directory for user and change it's ownership and permiision

	$ hdfs dfs -mkdir -p /user/<username>
	$ hdfs dfs -chown <username> /user/<username>
	$ hdfs dfs -chmod 750 /user/<username>


### Test Hadoop Installation with Mapreduce Example

* Copy the input files into the distributed filesystem

```sh
$ hdfs dfs -put $HADOOP_CONF_DIR input
```

* Run some of the examples provided

```sh
$ hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.0.3.jar  wordcount input output

Or

$ hadoop jar $HADOOP_HOME/share/hadoop/mapreduce/hadoop-mapreduce-examples-3.0.3.jar pi 10 100
```
If running multiple time first clean output directory or user different

```sh
$ hdfs dfs -rm -r -f output 	# to clean directory
```

