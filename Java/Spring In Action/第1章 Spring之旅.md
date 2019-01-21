# 1.1 简化Java开发

Spring采取以下四种关键策略来降低Java开发的复杂性：
* 基于POJO的轻量级和最小侵入性编程；
* 通过依赖注入（DI）和面向接口（AOP）实现松耦合；
* 基于切面和惯例进行声明式编程；
* 通过切面和模板减少样板式代码。

什么是JavaBean？
JavaBean是一个遵循特定写法的Java类，是一种Java语言编写的可重用组件，它的方法命名，构造及行为必须符合特定的约定：
1、这个类必须具有一个公共的(public)无参构造函数；
2、所有属性私有化（private）；
3、私有化的属性必须通过public类型的方法（getter和setter）暴露给其他程序，并且方法的命名也必须遵循一定的命名规范。 
4、这个类应是可序列化的。（比如可以实现Serializable 接口，用于实现bean的持久性）

# 1.2 容纳你的Bean

在基于Spring的应用中，你的应用对象生存于Spring容器中。Spring容器负责创建对象，装配它们，并管理它们的整个声明周期。

Spring容器并不是只有一个。Spring自带多个容器实现，可以归为两种不同类型：
* bean工厂。提供基本的DI支持。
* 应用上下文。基于BeanFactory构建，并提供应用框架级别的服务。

## 1.2.1 使用应用上下文

Spring自带了多种类型的应用上下文。下面是几个常用的：
* `AnnotationConfigApplicationContext`：从一个或多个基于Java的配置类中加载Spring应用上下文。
* `AnnotationCOnfigWebApplicationContext`：从一个或多个基于Java的配置类中加载Spring Web应用上下文。
* `ClassPathXmlApplicationContext`：从类路径下的一个或多个XML配置文件中加载上下文定义。把应用上下文的定义文件作为类资源。
* `FileSystemXmlApplicationContext`：从文件系统下的一个或多个XML配置文件中加载上下文定义。
* `XmlWebApplicationContext`：从Web应用下的一个或多个XML配置文件中加载上下文定义。

应用上下文准备就绪之后，我们就可以调用上下文的getBean()方法从Spring容器中获取bean。

## 1.2.2 bean的生命周期

bean生命周期：
1. Spring对bean进行实例化。
2. Spring将bean的引用注入到bean对应的属性中。
3. 如果bean实现了一系列的生命周期钩子接口，那么Spring将依次调用它们。（与Angular组件的生命周期钩子一样）