
-- Проверка таблицы bot_wordroot_words на разные флаги одного и того же корневого слова, чего не должно быть
SELECT wordroot, count(flag) AS cnt  FROM (
  SELECT DISTINCT wl.wordroot, wr.flag
  	FROM bot_wordroot_words wr 
	    LEFT JOIN bot_wordroot_list wl ON wr.wordroot_rf = wl.wordroot_id	
 	)		
  GROUP BY  wordroot
  HAVING count(flag) > 1
  ORDER BY wordroot
  LIMIT 11