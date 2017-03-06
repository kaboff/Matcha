module.exports = {

   getage: function(birth) {
        var today = new Date();
        var nowyear = today.getFullYear();
        var nowmonth = today.getMonth();
        var nowday = today.getDate();

        var birthyear = birth.getFullYear();
        var birthmonth = birth.getMonth();
        var birthday = birth.getDate();

        var age = nowyear - birthyear;
        var age_month = nowmonth - birthmonth;
        var age_day = nowday - birthday;
       
        if(age_month < 0 || (age_month == 0 && age_day <0)) {
                age = parseInt(age) -1;
        }
        return age;
    },
    isValidDate: function(dateStr) {
        var msg = "";
        var datePat = /^(\d{1,2})(\/|-)(\d{1,2})\2(\d{4})$/;

        var matchArray = dateStr.match(datePat);
        if (matchArray == null) {
            msg = "Votre date de naissance n'est pas un format valide.";
            return msg;
        }

        month = matchArray[1];
        day = matchArray[3];
        year = matchArray[4];

       
        if (month < 1 || month > 12) {
            msg = "Les mois sont compris entre 1 et 12";
            return msg;
        }

        if (day < 1 || day > 31) {
            msg = "Le jours sont du 1 au 31.";
            return msg;
        }   

        if ((month==4 || month==6 || month==9 || month==11) && day==31) {
            msg = "Le mois de "+month+" n'a pas de 31 !";
            return msg;
        }

        if (month == 2) {
        var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
        if (day>29 || (day==29 && !isleap)) {
            msg = "Le fevrier " + year + " n'a pas de " + day + " !";
            return msg;
        }
        }

        if (day.charAt(0) == '0') day= day.charAt(1);
        return msg;
    },
    getTime: function (date) {
        function dateDiff(date1, date2){
            var diff = {}                           // Initialisation du retour
            var tmp = date2 - date1;
         
            tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
            diff.sec = tmp % 60;                    // Extraction du nombre de secondes
         
            tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
            diff.min = tmp % 60;                    // Extraction du nombre de minutes
         
            tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
            diff.hour = tmp % 24;                   // Extraction du nombre d'heures
             
            tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
            diff.day = tmp;
             
            return diff;
        }
        var time = dateDiff(new Date(date), new Date());
        if (time.day)
           return ' Il y a '+time.day+' jours ';
        else if (time.hour)
            return ' Il y a '+time.hour+' heures ';
        else if (time.min)
            return ' Il y a '+time.min+' minutes';
        else
            return ' Il y a moins de 1 minute';
    },
    Capitalize: function(name)
    {
        return name.charAt(0).toUpperCase() + name.substring(1).toLowerCase();
    },
    exist_on_json: function(my_id, other_id, json)
    {
        if (json && json[0])
        {
            for (var i = 0; json[i]; i++) {
                if (json[i]['action_receiver'] == other_id && json[i]['action_sender'] == my_id)
                    if (json[i]['action'] == 'like')
                        return 'like';
                    else if (json[i]['action'] == 'dislike')
                        return 'dislike';
            };
        }
        return false;
    },
    its_a_match_or_not: function(my_id, other_id, json)
    {
        if (json && json[0])
        {
            var one = false;
            var two = false;
            for (var i = 0; json[i]; i++) {
                if (json[i]['action_receiver'] == other_id && json[i]['action_sender'] == my_id && json[i]['action'] == 'like')
                    one = true;
                if (json[i]['action_receiver'] == my_id && json[i]['action_sender'] == other_id && json[i]['action'] == 'like')
                    two = true;
            };
        }
        if (one && two)
            return true
        return false;
    },
    me_like: function(my_id, other_id, json)
    {
        if (json && json[0])
        {
            var one = false;
            for (var i = 0; json[i]; i++) {
                if (json[i]['action_receiver'] == other_id && json[i]['action_sender'] == my_id && json[i]['action'] == 'like')
                    one = true;
            };
        }
        if (one)
            return true
        return false;
    },
    other_like: function(my_id, other_id, json)
    {
        if (json && json[0])
        {
            var one = false;
            for (var i = 0; json[i]; i++) {
                if (json[i]['action_receiver'] == my_id && json[i]['action_sender'] == other_id && json[i]['action'] == 'like')
                    one = true;
            };
        }
        if (one)
            return true
        return false;
    },
    return_action_json: function(my_id, other_id, json)
    {
        if (json && json[0])
        {
            for (var i = 0; json[i]; i++) {
                if (json[i]['action_receiver'] == my_id && json[i]['action_sender'] == other_id)
                    if (json[i]['action'] == 'like')
                        return json[i]['action_created_at'];
                    if (json[i]['action'] == 'visite')
                        return json[i]['action_created_at'];
            };
        }
        return false;
    },
    see_or_not: function(my_id, other_id, json)
    {
        if (json && json[0])
        {
            for (var i = 0; json[i]; i++) {
                if (json[i]['action_receiver'] == my_id && json[i]['action_sender'] == other_id)
                {
                    if (json[i]['action'] == 'like' && json[i]['action_see'] == 0)
                        return true
                    if (json[i]['action'] == 'visite' && json[i]['action_see'] == 0)
                        return true
                }
            };
        }
        return false;
    },
    tags: function(my_tags, user_tags)
    {
        if (my_tags && user_tags)
        {
            var tags_array = [];
            var find = 0;
            my_tags_split = my_tags.toString().split(';');
            user_tags_split = user_tags.toString().split(';');
            if (my_tags_split[0] && user_tags_split[0])
            {
                for (var i = 0; user_tags_split[i]; i++) {
                    for (var o = 0; my_tags_split[o]; o++) {
                        if (my_tags_split[o].toString() == user_tags_split[i].toString())
                        {
                            if (tags_array && tags_array[0])
                            {
                                for (var z = 0; tags_array[z]; z++) {
                                    if (my_tags_split[o] == tags_array[z])
                                        find++;
                                };
                                if (!find)
                                    tags_array.push(my_tags_split[o].toString());
                                find = 0;
                            }
                            else
                                 tags_array.push(my_tags_split[o].toString());
                        }
                    };
                };
            }
            return tags_array.length;
        }
        else
            return 0;
    },
    bloque_or_not: function(my_id, other_id, json)
    {
        if (json && json[0])
        {
            for (var i = 0; json[i]; i++) {
                if (json[i]['action_receiver'] == my_id && json[i]['action_sender'] == other_id && json[i]['action'] == 'bloque')
                    return true;
                else if (json[i]['action_receiver'] == other_id && json[i]['action_sender'] == my_id && json[i]['action'] == 'bloque')
                    return true;
            };
        }
        return false;
    }
};