from string import Template


def start_response(resp='text/html'):
    return 'Content-type: ' + resp + '\n\n'


def include_header(the_title):
    with open('template/header.html') as headf:
        head_text = headf.read()
    header = Template(head_text)
    return header.substitute(title=the_title)


def include_footer(the_links):
    with open('template/footer.html') as footerf:
        foot_text = footerf.read()
    link_string = ''
    for key in the_links:
        link_string += '<a href="' + the_links[key] + '">' + key + '</a>&nbsp;&nbsp;&nbsp;&nbsp;'
    footer = Template(foot_text)
    return footer.substitute(links=link_string)


def start_form(the_url, form_type='POST'):
    return '<form action="' + the_url + '" method="' + form_type + '">'


def end_form(submit_msg="Submit"):
    return '<p></p><input type=submit value="' + submit_msg + '">'


def radio_button(rb_name, rb_value):
    return '<input type="radio" name="' + rb_name + '" value="' + rb_value + '"> ' + rb_value + '<br />'


def u_list(items):
    u_string = '<ul>'
    for item in items:
        u_string += '<li>' + item + '</li>'
    u_string += '</ul>'
    return u_string


def header(head_text, header_level=2):
    return '<h' + str(header_level) + '>' + head_text + '</h' + header_level + '>'


def para(para_text):
    return '<p>' + para_text + '</p>'
