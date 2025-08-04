# Bank Yahav scraper

## Algorithm

Scraping session works as follows:

1. Go back 6 months in **FROM** date
2. Select the first eligible date
3. Go back 6 months in **TO** date
4. Select the last eligible date (so now we've selected first-to-last in the NOW-6-MONTHS month)
5. Scrape transactions
6. Progress 1 month in **TO** date (must do this before progressing the **FROM** date)
7. Progress 1 month in **FROM** date
8. Repeat steps #5, #6, #7 for 6 times

## DOM structure

```
div.transactions > div.transactionList
    > div.row.header                        -> table headers
    > div.list-item-holder                  -> transaction rows...
        > div[role=row]
            > div.row
                > div.col > span            -> DATE: 30/06/2024
                > div.col > span            -> REF: &#x202D;12-799-000803480 (&#x202d = Left To Right Override; see https://www.codetable.net/hex/202d)
                > div.col
                    > span                  -> DESCRIPTION: &#x202B;ב.הפועלים-ביט/&#x202B;דוד דוול/&#x202B;26.6 (&#x202B; = Right-To-Left Embedding; see https://www.codetable.net/hex/202b)
                    > span.icon.debitcard   -> clicking this will navigate to debitcard data
                > div.col > span?           -> DEBIT: 350.00&nbsp;
                > div.col > span?           -> CREDIT: 350.00&nbsp;
                > div.col
                    > div
                        > span -> BALANCE: 11,952.79&nbsp;
                        > span.icon -> clicking this will open the row's "div.expanded-data"
            > div.expanded-data
```

## ROADMAP

- [ ] Debit credit cards
- [ ] Foreign currencies
- [ ] Savings deposits
