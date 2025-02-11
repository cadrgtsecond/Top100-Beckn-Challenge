import 'package:dio/dio.dart';

import '../../../constants/api_const/api_const.dart';
import '../../interceptor/app_dio.dart';

class SearchWithNameApi {
  Future searchWithName(String name) async {
    const String subUrl = "/search";
    const String uri = AppAPI.baseUrl + subUrl;
    final bodyData = {
      "context": {
        "domain": "{{dsep:talent}}",
        "action": "search",
        "version": "{{core_version}}",
        "bap_id": "{{bap_id}}",
        "bap_uri": "{{bap_uri}}",
        "location": {
          "country": {"name": "India", "code": "IND"},
          "city": {"name": "Bangalore", "code": "std:080"}
        },
        "timestamp": "2022-12-15T15:38:16.226Z",
        "message_id": "64109204-bdff-4af6-a76b-5a33f8aa8675",
        "transaction_id": "bdb5ba09-2241-4f00-b434-73466cd06228"
      },
      "message": {
        "intent": {
          "item": {
            "descriptor": {"name": name}
          }
        }
      }
    };

    final response = await Api().dio.post(
          uri,
          data: bodyData,
          options: Options(
            headers: {
              "accept": "*/*'",
              "Accept-Encoding": "gzip, deflate, br",
              "Connection": "keep-alive"
            },
            contentType: 'application/json',
          ),
        );

    final statusCode = response.statusCode;

    final body = response.data;
    if (statusCode == 201 || statusCode == 200) {
      return body;
    }
  }
}
